import os
import shutil
from flask import jsonify, request

def register_quarantine(app, EMAIL_FOLDER, QUARANTINE_FOLDER):
    if not os.path.exists(QUARANTINE_FOLDER):
        os.makedirs(QUARANTINE_FOLDER)

    @app.route('/quarantine', methods=['POST'])
    def quarantine_file():
        try:
            data = request.get_json()
            if not data or 'email' not in data:
                return jsonify({'status': 'failed', 'message': 'no email specified'}), 400
            email_file = data['email']
            source_path = os.path.join(EMAIL_FOLDER, email_file)
            if not os.path.exists(source_path):
                return jsonify({'status': 'failed', 'message': f'file {email_file} not found'}), 404
            dest_path = os.path.join(QUARANTINE_FOLDER, email_file)
            shutil.move(source_path, dest_path)
            return jsonify({'status': 'success', 'message': f'{email_file} moved to quarantine'})
        except Exception as e:
            return jsonify({'status': 'failed', 'message': f'error quarantining file: {repr(e)}'}), 500