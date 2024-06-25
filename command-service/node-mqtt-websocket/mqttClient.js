const mqtt = require('mqtt');
const logger = require('./logger');
require('dotenv').config();

const brokerUrl = process.env.MQTT_BROKER_URL;
const ekuiperTopic = process.env.EKUIPER_TOPIC || '#';

const setupMqttClient = (io) => {
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    logger.debug('Connected to MQTT broker');
    client.subscribe(`${ekuiperTopic}+`, (err) => {
      if (!err) {
        logger.debug(`Subscribed to the topic: ${ekuiperTopic}`);
      } else {
        logger.error('Failed to subscribe:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    try {
    let field, fieldValue;

    const topicParts = topic.split('/');
    if (topicParts.length > 1) {
        field = topicParts[1];
    }
        const messageString = `Received message on topic ${topic}, field ${field} surpassed its threshold value`;

        logger.debug(message);
        const messageStringData = message.toString('utf8').trim(); 
        const valueStartIndex = messageStringData.indexOf(':');
        if (valueStartIndex !== -1) {
            let valueString = messageStringData.substring(valueStartIndex + 1).trim();
            
            valueString = valueString.replace(/[^\d.-]/g, '');

            fieldValue = parseFloat(valueString);

            io.emit('mqtt_message', { topic, field, fieldValue, message: messageString });
            logger.debug(`Received message on topic ${topic} emitted to Socket.IO clients`);
        } else {
            console.warn('Colon not found in MQTT message payload');
        }
    } catch (error) {
        console.error('Error parsing or handling MQTT message:', error);
    }
});




  client.on('error', (err) => {
    logger.error('MQTT client error:', err);
  });
};

module.exports = { setupMqttClient };
