from flask import Flask
from flask_cors import CORS
import os
from routes.verify_file import register_verify_file , register_quarantine_for_file
from routes.scan_emails import register_scan_emails
from routes.hello import register_hello
from routes.get_logs import register_get_logs
from routes.quarantine import register_quarantine

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

EMAIL_FOLDER = os.path.join(os.path.dirname(__file__), 'emails')
if not os.path.exists(EMAIL_FOLDER):
    os.makedirs(EMAIL_FOLDER)

QUARANTINE_FOLDER = os.path.join(os.path.dirname(__file__), 'quarantine')
if not os.path.exists(QUARANTINE_FOLDER):
    os.makedirs(QUARANTINE_FOLDER)

# register routes
register_verify_file(app, UPLOAD_FOLDER , QUARANTINE_FOLDER)
register_scan_emails(app, EMAIL_FOLDER)
register_hello(app)
register_get_logs(app)
register_quarantine(app,EMAIL_FOLDER, QUARANTINE_FOLDER)



if __name__ == '__main__':
    app.run(debug=True)