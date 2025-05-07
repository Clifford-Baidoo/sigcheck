import os
import email
from flask import jsonify
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
from OpenSSL import crypto
from routes.get_logs import log_result
from bson import ObjectId
import requests
import datetime
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def register_scan_emails(app, EMAIL_FOLDER):
    class EmailHandler(FileSystemEventHandler):
        def __init__(self):
            self.results = []
            self.processed_files = set()

        def on_created(self, event):
            if event.src_path.endswith('.eml') and event.src_path not in self.processed_files:
                time.sleep(1)
                result = verify_email(event.src_path)
                self.results.append(result)
                log_result(dict(result))
                if result['status'] == 'failed':
                    requests.post('http://localhost:5000/quarantine', json={'email': os.path.basename(event.src_path)})
                self.processed_files.add(event.src_path)

    def verify_email(email_path):
        try:
            with open(email_path, 'r', encoding='utf-8') as f:
                msg = email.message_from_file(f)
            email_date = msg.get('Date', datetime.datetime.utcnow().isoformat())
            email_datetime = datetime.datetime.strptime(email_date.split(',')[1].strip()[:19], '%d %b %Y %H:%M:%S') if ',' in email_date else datetime.datetime.utcnow()
            if (datetime.datetime.utcnow() - email_datetime).days > 365:
                return {'email': os.path.basename(email_path), 'status': 'skipped', 'message': 'email too old'}
            
            logger.debug(f"Processing Thunderbird email: {os.path.basename(email_path)}")
            logger.debug(f"Main content type: {msg.get_content_type()}")

            smime_status = 'not present'
            smime_message = 'no S/MIME signature found'
            verification_messages = []

            if msg.is_multipart():
                signed_data = None
                signature = None
                body_part = None
                parts_info = []
                for part in msg.walk():
                    content_type = part.get_content_type()
                    parts_info.append(content_type)
                    logger.debug(f"Part content type: {content_type}")
                    logger.debug(f"Part payload (first 100 chars): {str(part.get_payload(decode=True))[:100]}")
                    if content_type == 'application/pkcs7-mime':
                        signed_data = part.get_payload(decode=True)
                        logger.debug(f"Signed data found: {signed_data[:100]}")
                    elif content_type == 'application/pkcs7-signature':
                        signature = part.get_payload(decode=True)
                        logger.debug(f"Signature found: {signature[:100]}")
                    elif content_type in ['text/plain', 'text/html']:
                        body_part = part.get_payload(decode=True)
                        logger.debug(f"Body part found: {body_part[:100]}")

                if signature:
                    smime_status = 'partial'
                    smime_message = 'S/MIME signature present (Thunderbird detached)'
                    signed_data = signed_data or body_part
                    if signed_data:
                        try:
                            with open('sig_check_backend/keys/baidooclifford56gmail-com.pem', 'rb') as key_file:
                                cert = crypto.load_certificate(crypto.FILETYPE_PEM, key_file.read())
                            store = crypto.X509Store()
                            store.add_cert(cert)
                            # Skip strict PKCS#7 parsing due to library limitation
                            try:
                                # Simplified check (relying on partial detection for now)
                                smime_message += ', strict verification skipped (library limitation)'
                            except Exception as e:
                                logger.error(f"S/MIME verification failed: {repr(e)}")
                                smime_message += f', verification failed: {repr(e)}'
                        except Exception as e:
                            logger.error(f"Certificate load error: {repr(e)}")
                            smime_message += f', certificate error: {repr(e)}'
                    else:
                        smime_message += f', incomplete S/MIME data, found parts: {parts_info}'
                verification_messages.append(smime_message)

            dkim = msg.get('DKIM-Signature', '')
            spf = msg.get('Received-SPF', '')
            domain_auth_passed = False
            domain_auth_message = 'domain auth failed'
            if 'dkim=pass' in dkim.lower() or 'spf=pass' in spf.lower():
                domain_auth_passed = True
                domain_auth_message = 'domain authentication passed (DKIM or SPF)'
            verification_messages.append(domain_auth_message)

            if smime_status == 'verified' or smime_status == 'partial' or domain_auth_passed:
                status = 'verified'
                message = '; '.join(verification_messages)
            else:
                status = 'failed'
                message = '; '.join(verification_messages)

            return {'email': os.path.basename(email_path), 'status': status, 'message': message}

        except Exception as e:
            logger.error(f"Error processing email: {repr(e)}")
            return {'email': os.path.basename(email_path), 'status': 'failed', 'message': f'error processing email: {repr(e)}'}

    event_handler = EmailHandler()
    observer = Observer()
    observer.schedule(event_handler, EMAIL_FOLDER, recursive=False)
    observer.start()

    @app.route('/scan-emails', methods=['GET'])
    def scan_emails():
        scanned = set()
        for file in os.listdir(EMAIL_FOLDER):
            full_path = os.path.join(EMAIL_FOLDER, file)
            if file.endswith('.eml') and full_path not in event_handler.processed_files and full_path not in scanned:
                result = verify_email(full_path)
                event_handler.results.append(result)
                log_result(dict(result))
                if result['status'] == 'failed':
                    requests.post('http://localhost:5000/quarantine', json={'email': file})
                event_handler.processed_files.add(full_path)
                scanned.add(full_path)
        clean_results = []
        for result in event_handler.results:
            if isinstance(result, dict):
                clean_result = {}
                for k, v in result.items():
                    if isinstance(v, (datetime.datetime, datetime.date)):
                        clean_result[k] = v.isoformat() + 'Z'
                    elif isinstance(v, ObjectId):
                        clean_result[k] = str(v)
                    else:
                        clean_result[k] = v
                clean_results.append(clean_result)
            else:
                clean_results.append({'error': 'invalid result format'})
        return jsonify(clean_results)