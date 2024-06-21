import { Request, Response } from 'express';
import { InfluxDB, WriteApi, Point } from '@influxdata/influxdb-client';
import { SensorData } from '../types';
import influx from 'influx';
import logger from '../utils/Logger';

class DataController {
   private influxDB: InfluxDB;
   private writeApi:WriteApi;

   
   constructor() {
    const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
    const token = process.env.INFLUXDB_TOKEN || 'my-token';
    const org = process.env.INFLUXDB_ORG || 'my-org';
    const bucket = process.env.INFLUXDB_BUCKET || 'my-bucket';

    this.influxDB = new InfluxDB({ url, token });
    this.writeApi = this.influxDB.getWriteApi(org, bucket);

    logger.info(`Connected to InfluxDB at ${url}`);
  }

  public async writeData(data: any) {
    const point = new Point('sensor_data')
      .tag('sensor', data.sensor)
      .floatField('temperature', data.temperature)
      .floatField('humidity', data.humidity);

    this.writeApi.writePoint(point);
    await this.writeApi.flush();
    logger.info(`Data written to InfluxDB: ${JSON.stringify(data)}`);
  }

}

export default new DataController();
