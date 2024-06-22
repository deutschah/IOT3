import { InfluxDB, WriteApi, Point } from '@influxdata/influxdb-client';
import logger from '../utils/Logger';

class DataController {
  private influxDB: InfluxDB;
  private writeApi: WriteApi;

  constructor() {
    const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
    const token = process.env.INFLUXDB_TOKEN || 'I8qPVnEyudv__zt_txtId-G4Wb0bIiUMfQETSVr6ZqR-xE421mVku7zSVkUFRtFQ0F2SNFJ2I5mgxIYPTlDdkQ==';
    const org = process.env.INFLUXDB_ORG || 'IOT3';
    const bucket = process.env.INFLUXDB_BUCKET || 'IOT3';

    this.influxDB = new InfluxDB({ url, token });
    this.writeApi = this.influxDB.getWriteApi(org, bucket);

    logger.info(`Connected to InfluxDB at ${url}`);
  }

  public async writeData(data: any) {
    const point = new Point('sensor_data')
      .tag('sensor', data.sensor)
      .floatField('DC_POWER', data.DC_POWER)
      .floatField('AC_POWER', data.AC_POWER)
      .floatField('DAILY_YIELD', data.DAILY_YIELD)
      .floatField('TOTAL_YIELD', data.TOTAL_YIELD);

    this.writeApi.writePoint(point);
    await this.writeApi.flush();
    logger.info(`Data written to InfluxDB: ${JSON.stringify(data)}`);
  }
}

export default new DataController();
