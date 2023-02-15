from flask import Flask, redirect, url_for
from login import login_bp
from student import student_bp
import streamlit as st
import streamlit.hashing 


@app.route('/')
def index():
    return redirect(url_for('login.login_page'))



from streamlit.report_thread import get_report_ctx
from streamlit.server.server import Server


# Create a Flask app and register the blueprints
app = Flask(__name__)
app.register_blueprint(login_bp)
app.register_blueprint(student_bp)

# Start the Flask server
@app.before_first_request
def before_first_request():
    app.server = Server.get_current()._server

# Connect to the Flask app using FlaskClient
with st.echo(code_location='below'):
    from streamlit.hashing import _CodeHasher
    hasher = _CodeHasher()
    ctx = get_report_ctx()
    session_id = ctx.session_id
    app_hash = hasher.to_bytes(app)

    with Server._get_or_create_st_session(session_id) as sess:
        if not hasattr(sess, '_custom_session_state'):
            setattr(sess, '_custom_session_state', {})
        session_state = sess._custom_session_state
        if 'flask_client' not in session_state:
            session_state['flask_client'] = FlaskClient(app, session_id, app_hash)

    flask_client = session_state['flask_client']

# Create a Streamlit app that connects to the Flask app
with st.echo(code_location='below'):
    st.write('Welcome')
