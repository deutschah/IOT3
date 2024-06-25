const http = require('http');
const socketIo = require('socket.io');
const { setupMqttClient } = require('./mqttClient');
const logger = require('./logger');
require('dotenv').config();

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
});

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  logger.debug('Client connected');

  socket.on('disconnect', () => {
    logger.debug('Client disconnected');
  });
});

setupMqttClient(io);

const PORT = process.env.PORT;
server.listen(PORT, '0.0.0.0', () => {
  logger.debug(`Server running at http://0.0.0.0:${PORT}`);
});
