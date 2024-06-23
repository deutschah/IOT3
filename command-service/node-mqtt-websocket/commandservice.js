const mqtt = require('mqtt');
const io = require('socket.io-client');
const http = require('http');

const logger = {
  debug: console.log
};

const handler = (req, res) => {
  res.writeHead(200);
  res.end('Hello, world!');
};

const server = http.createServer(handler);
const socket = io('http://client:80');

socket.on('connect', () => {
  logger.debug('Connected to Socket.IO server');
});

server.listen(4000, '0.0.0.0', () => {
  console.log('Server running at http://127.0.0.1:4000/');
});

const brokerUrl = 'mqtt://my-mqtt-broker:1883';
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
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});
