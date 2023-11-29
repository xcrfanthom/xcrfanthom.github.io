document.addEventListener('DOMContentLoaded', function () {
    var socket = io();
    var messagesContainer = document.getElementById('messages');
    var messageForm = document.getElementById('messageForm');
    var messageInput = document.getElementById('messageInput');
    var logoutButton = document.getElementById('logoutBtn');

    function addMessage(message) {
        var messageElement = document.createElement('div');
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    socket.on('receive_message', function (data) {
        var message = `${data.sender}: ${data.message}`;
        addMessage(message);
    });

    socket.on('user_logged_in', function (data) {
        var message = data.username + ' joined the chat';
        addMessage(message);
    });

    socket.on('user_logged_out', function (data) {
        var message = data.username + ' left the chat';
        addMessage(message);
    });

    function sendMessage(message) {
        socket.emit('send_message', message);
    }

    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var message = messageInput.value.trim();
        if (message !== '') {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    logoutButton.addEventListener('click', function () {
        fetch('/logout', {
            method: 'POST',
        })
        .then(response => {
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('Logout failed:', error);
            window.location.href = '/login';
        });
    });
});
