from flask import Flask, render_template, request, redirect
import student
import login

app = Flask(__name__)

# Route for the login page
@app.route('/')
def login_interface():
    return login1.login_page()

# Route for handling the login form submission
@app.route('/login', methods=['POST'])
def handle_login():
    username = request.form['username']
    password = request.form['password']
    if login.authenticate(username, password):
        # Redirect to the student interface page
        return redirect('/student1')
    else:
        return render_template('login.html', error=True)

# Route for the student interface page
@app.route('/student1')
def student_interface():
    return student1.student_page()

if __name__ == '__main__':
    app.run(debug=True)
