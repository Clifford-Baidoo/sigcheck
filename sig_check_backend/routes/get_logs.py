from pymongo import MongoClient
import datetime
from bson import ObjectId
from flask import jsonify

client = MongoClient('mongodb://localhost:27017/')
db = client['sig_check_db']
logs_collection = db['logs']

def register_get_logs(app):
    @app.route('/get-logs', methods=['GET'])
    def get_logs():
        logs = list(logs_collection.find().sort('timestamp', -1))
        clean_results = []
        for result in logs:
            clean_result = {}
            for k, v in result.items():
                if isinstance(v, (datetime.datetime, datetime.date)):
                    clean_result[k] = v.isoformat() + 'Z'
                elif isinstance(v, ObjectId):
                    clean_result[k] = str(v)
                else:
                    clean_result[k] = v
            clean_results.append(clean_result)
        return jsonify(clean_results)

def log_result(result):
    # Use 'email' if present, otherwise use 'file' as a fallback
    identifier = result.get('email') or result.get('file')
    if not identifier:
        identifier = 'unknown'  # Fallback if neither is present

    # Check for recent duplicate
    last_log = logs_collection.find_one({ '$or': [
        {'email': identifier},
        {'file': identifier}
    ]}, sort=[('timestamp', -1)])
    if last_log and (datetime.datetime.utcnow() - last_log['timestamp']).total_seconds() < 60:
        return  # Skip if logged within the last minute
    

    result['timestamp'] = datetime.datetime.utcnow()
    logs_collection.insert_one(result)

