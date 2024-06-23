document.addEventListener("DOMContentLoaded", function () {
    const socket = io('http://localhost:4000');   


    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('mqtt_message', (msg) => {
        console.log('Received message:', msg);
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = msg;
        messagesDiv.appendChild(messageElement);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
    });
});
