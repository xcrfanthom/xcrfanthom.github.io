document.addEventListener('DOMContentLoaded', function () {
    var socket = io();
    var systemMessagesContainer = document.getElementById('systemMessages');

    socket.on('user_logged_in', function (data) {
        var message = 'Welcome, ' + data.username + '!';
        addSystemMessage(message);
    });

    function addSystemMessage(message) {
        var messageElement = document.createElement('div');
        messageElement.textContent = message;
        systemMessagesContainer.appendChild(messageElement);
    }
});