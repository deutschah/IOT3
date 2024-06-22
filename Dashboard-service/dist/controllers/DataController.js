"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const influxdb_client_1 = require("@influxdata/influxdb-client");
const Logger_1 = __importDefault(require("../utils/Logger"));
class DataController {
    constructor() {
        const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
        const token = process.env.INFLUXDB_TOKEN || 'TqCwPwdZFDHVro4pTdvaYj4jY8OpBtBULBPtS8f-ZPIhapiQoFHc2C7eAZ-P-2HB0XxCp5DeQXN3S89LAc8dQA==';
        const org = process.env.INFLUXDB_ORG || 'IOT3';
        const bucket = process.env.INFLUXDB_BUCKET || 'IOT3';
        this.influxDB = new influxdb_client_1.InfluxDB({ url, token });
        this.writeApi = this.influxDB.getWriteApi(org, bucket);
        Logger_1.default.info(`Connected to InfluxDB at ${url}`);
    }
    writeData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const point = new influxdb_client_1.Point('sensor_data')
                .tag('sensor', data.sensor)
                .floatField('DC_POWER', data.DC_POWER)
                .floatField('AC_POWER', data.AC_POWER)
                .floatField('DAILY_YIELD', data.DAILY_YIELD)
                .floatField('TOTAL_YIELD', data.TOTAL_YIELD);
            this.writeApi.writePoint(point);
            yield this.writeApi.flush();
            Logger_1.default.info(`Data written to InfluxDB: ${JSON.stringify(data)}`);
        });
    }
}
exports.default = new DataController();
