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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nats_1 = require("nats");
const nats_2 = require("nats");
const Logger_1 = __importDefault(require("../utils/Logger"));
class NATSService {
    constructor() {
        this.nc = null;
        this.subscription = null;
    }
    connect(natsServer, topic, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.nc = yield (0, nats_2.connect)({ servers: natsServer });
                Logger_1.default.info(`Connected to NATS server at ${natsServer}`);
                this.subscription = this.nc.subscribe(topic);
                const sc = (0, nats_1.StringCodec)();
                if (this.subscription) {
                    (() => __awaiter(this, void 0, void 0, function* () {
                        var _a, e_1, _b, _c;
                        try {
                            for (var _d = true, _e = __asyncValues(this.subscription), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                                _c = _f.value;
                                _d = false;
                                const message = _c;
                                const data = JSON.parse(sc.decode(message.data));
                                callback(data);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }))();
                }
                else {
                    throw new Error('Failed to create subscription');
                }
            }
            catch (error) {
                Logger_1.default.error(`Failed to connect to NATS server: ${error.message}`);
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nc) {
                yield this.nc.close();
                Logger_1.default.info('Disconnected from NATS server');
            }
        });
    }
}
exports.default = new NATSService();
