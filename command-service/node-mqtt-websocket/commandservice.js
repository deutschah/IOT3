const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');

// MQTT broker URL
const brokerUrl = 'mqtt://my-mqtt-broker:1883';

// Logger for debugging
const logger = {
  debug: console.log
};

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end('Hello, world!');
});

// Set up Socket.IO server
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('#', (err) => {
    if (!err) {
      console.log('Subscribed to all topics');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

client.on('message', (topic, message) => {
  const messageString = message.toString();
  console.log(`Received message on topic ${topic}: ${messageString}`);

  io.emit('mqtt_message', { topic, message: messageString });
  console.log('Message emitted to Socket.IO clients');
});

server.listen(4000, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:4000');
});
