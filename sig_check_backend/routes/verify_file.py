import os
import hashlib
import shutil
import requests
from flask import jsonify, request, send_from_directory
from PyPDF2 import PdfReader
from routes.get_logs import log_result

def register_verify_file(app, PDF_FOLDER, QUARANTINE_FOLDER):
    if not os.path.exists(PDF_FOLDER):
        os.makedirs(PDF_FOLDER)
    if not os.path.exists(QUARANTINE_FOLDER):
        os.makedirs(QUARANTINE_FOLDER)

    @app.route('/verify-file', methods=['POST'])
    def verify_file():
        if 'file' not in request.files:
            result = {'file': 'unknown', 'status': 'failed', 'message': 'no file uploaded'}
            log_result(result)
            return jsonify(result), 400

        file = request.files['file']
        if file.filename == '':
            result = {'file': 'unknown', 'status': 'failed', 'message': 'no file selected'}
            log_result(result)
            return jsonify(result), 400
        if not file.filename.endswith('.pdf'):
            result = {'file': file.filename, 'status': 'failed', 'message': 'only PDFs allowed'}
            log_result(result)
            return jsonify(result), 400

        file_path = os.path.join(PDF_FOLDER, file.filename)
        try:
            file.save(file_path)
        except Exception as e:
            result = {'file': file.filename, 'status': 'failed', 'message': f'failed to save file: {repr(e)}'}
            log_result(result)
            return jsonify(result), 500

        try:
            reader = PdfReader(file_path)
            if '/AcroForm' in reader.trailer['/Root']:
                if '/SigFlags' in reader.trailer['/Root']['/AcroForm']:
                    result = {
                        'file': file.filename,
                        'status': 'verified',
                        'message': 'PDF contains a digital signature'
                    }
                    log_result(result)
                    return jsonify(result)
                else:
                    result = {
                        'file': file.filename,
                        'status': 'failed',
                        'message': 'PDF has form fields but no signature'
                    }
                    log_result(result)
            else:
                with open(file_path, 'rb') as f:
                    hash_obj = hashlib.sha256()
                    hash_obj.update(f.read())
                    file_hash = hash_obj.hexdigest()
                expected_hash = 'your_expected_sha256_hash_here'
                if file_hash == expected_hash:
                    result = {
                        'file': file.filename,
                        'status': 'verified',
                        'message': f'PDF hash matches, hash: {file_hash}'
                    }
                    log_result(result)
                    return jsonify(result)
                else:
                    result = {
                        'file': file.filename,
                        'status': 'failed',
                        'message': f'PDF hash mismatch, computed: {file_hash}, expected: {expected_hash}'
                    }
                    log_result(result)
        except Exception as e:
            result = {'file': file.filename, 'status': 'failed', 'message': f'error verifying file: {repr(e)}'}
            log_result(result)
            return jsonify(result), 500

        if result['status'] == 'failed':
            try:
                requests.post('http://localhost:5000/quarantine-file', json={'file': file.filename})
            except Exception as e:
                result['message'] += f' (quarantine failed: {repr(e)})'
        return jsonify(result)

    @app.route('/view-file/<filename>', methods=['GET'])
    def view_file(filename):
        try:
            # First try the PDF_FOLDER
            file_path = os.path.join(PDF_FOLDER, filename)
            if os.path.exists(file_path):
                return send_from_directory(PDF_FOLDER, filename, as_attachment=False)
            # If not found, try QUARANTINE_FOLDER
            quarantine_path = os.path.join(QUARANTINE_FOLDER, filename)
            if os.path.exists(quarantine_path):
                return send_from_directory(QUARANTINE_FOLDER, filename, as_attachment=False)
            return jsonify({'status': 'failed', 'message': 'file not found'}), 404
        except Exception as e:
            return jsonify({'status': 'failed', 'message': f'error serving file: {repr(e)}'}), 500

def register_quarantine_for_file(app, PDF_FOLDER, QUARANTINE_FOLDER):
    @app.route('/quarantine-file', methods=['POST'])
    def quarantine_file():
        try:
            data = request.get_json()
            if not data or 'file' not in data:
                return jsonify({'status': 'failed', 'message': 'no file specified'}), 400
            pdf_file = data['file']
            source_path = os.path.join(PDF_FOLDER, pdf_file)
            if not os.path.exists(source_path):
                return jsonify({'status': 'failed', 'message': f'file {pdf_file} not found'}), 404
            dest_path = os.path.join(QUARANTINE_FOLDER, pdf_file)
            shutil.move(source_path, dest_path)
            return jsonify({'status': 'success', 'message': f'{pdf_file} moved to quarantine'})
        except Exception as e:
            return jsonify({'status': 'failed', 'message': f'error quarantining file: {repr(e)}'}), 500