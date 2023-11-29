from flask import Flask, render_template, request, redirect, session, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
socketio = SocketIO(app)

users = {
    "1": "1",
    "2": "2"
}

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            session['username'] = username
            socketio.emit('user_logged_in', {'username': username})
            return redirect('/chat')
        else:
            return render_template('login.html', error='Invalid username or password')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        if username not in users:
            users[username] = password
            return redirect('/')
        else:
            return render_template('register.html', error='Username already exists')
    return render_template('register.html')

@app.route('/chat')
def chat():
    if 'username' in session and session['username'] in users:
        return render_template('chat.html', username=session['username'])
    return redirect('/login')

@socketio.on('send_message')
def handle_message(message):
    if 'username' in session:
        sender = session['username']
        emit('receive_message', {'sender': sender, 'message': message}, broadcast=True)

@app.route('/check_user', methods=['POST'])
def check_user():
    data = request.get_json()
    username = data.get('username')
    user_exists = username in users
    return jsonify({"exists": user_exists})

@app.route('/logout', methods=['POST'])
def logout():
    if 'username' in session:
        username = session.pop('username', None)
        if username:
            socketio.emit('user_logged_out', {'username': username})
    return redirect('/login')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)