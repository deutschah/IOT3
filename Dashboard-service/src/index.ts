import * as dotenv from 'dotenv';
import express from 'express';
import NATSService from './services/NATSService';
import DataController from './controllers/DataController';
import logger from './utils/Logger';
import { SensorData } from './types';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  logger.info(`Dashboard service is running on port ${PORT}`);
});


const NATS_SERVER = process.env.NATS_SERVER || 'nats://localhost:4222';
const NATS_TOPIC = process.env.NATS_TOPIC || 'sensor/data';

const processData = (data: SensorData) => {
  try{
  //logger.info(`Received data: ${JSON.stringify(data)}`);
  logger.info(`Received data: ${(data)}`);
  DataController.writeData(data);
  }
  catch(e){
   throw e;
  }
};

(async () => {
  await NATSService.connect(NATS_SERVER, NATS_TOPIC, processData);
})();

