from flask import Flask

def register_hello(app):
    @app.route('/hello')
    def hello():
        return 'backend is alive!'