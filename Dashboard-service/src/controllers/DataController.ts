import { InfluxDB, WriteApi, Point } from '@influxdata/influxdb-client';
import logger from '../utils/Logger';
import { SensorData } from '../types';
import config from '../configuration';

class DataController {
  private static instance: DataController;
  private influxDB: InfluxDB;
  private writeApi: WriteApi;

  private constructor() {
    const { url, token, org, bucket } = config.influxdb;
    this.influxDB = new InfluxDB({ url, token });
    this.writeApi = this.influxDB.getWriteApi(org, bucket);
    logger.info(`Connected to InfluxDB at ${url}`);
  }

  public static getInstance(): DataController {
    if (!DataController.instance) {
      DataController.instance = new DataController();
    }
    return DataController.instance;
  }

  public async writeData(data: SensorData): Promise<void> {
    try {
      const point = this.createPoint(data);
      this.writeApi.writePoint(point);
      await this.writeApi.flush();
      logger.info(`Data written to InfluxDB: ${JSON.stringify(data)}`);
    } catch (error) {
      logger.error(`Failed to write data to InfluxDB: ${error}`);
    }
  }

  private createPoint(data: SensorData): Point {
    return new Point('sensor_data')
      .tag('sensor', data.sensor)
      .floatField('DC_POWER', data.DC_POWER)
      .floatField('AC_POWER', data.AC_POWER)
      .floatField('DAILY_YIELD', data.DAILY_YIELD)
      .floatField('TOTAL_YIELD', data.TOTAL_YIELD);
  }
}
export default DataController.getInstance();
 
