import nats, { NatsConnection, Subscription, StringCodec } from 'nats';
import {connect } from 'nats'
import { SensorData } from '../types';
import logger from '../utils/Logger';

class NATSService {
  private nc: NatsConnection | null = null;
  private subscription: Subscription | null = null;

  async connect(natsServer: string, topic: string, callback: (data: SensorData) => void) {
    try {
      this.nc = await connect({ servers: natsServer });
      logger.info(`Connected to NATS server at ${natsServer}`);
      this.subscription = this.nc.subscribe(topic);
      const sc = StringCodec();
 
      if (this.subscription) {
        (async () => {
          for await (const message of this.subscription!) { 
            const data: SensorData = JSON.parse(sc.decode(message.data));

            callback(data);
          }
        })();
      } else {
        throw new Error('Failed to create subscription');
      }
    } catch (error: any) {
      logger.error(`Failed to connect to NATS server: ${error.message}`);
    }
  }

  async disconnect() {
    if (this.nc) {
      await this.nc.close();
      logger.info('Disconnected from NATS server');
    }
  }
}

export default new NATSService();