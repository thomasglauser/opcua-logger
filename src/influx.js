require('dotenv').config();

import { InfluxDB } from '@influxdata/influxdb-client';
import { PingAPI } from '../packages/apis';

INFLUX_URL = process.env.INFLUX_URL;
INFLUX_TOKEN = proccess.env.INFLUX_TOKEN;
INFLUX_ORG = process.env.INFLUX_ORG;
INFLUX_BUCKET = process.env.INFLUX_BUCKET;

const LOG = require('log4js').getLogger('influx');
const INFLUX = new InfluxDB({ INFLUX_URL, INFLUX_TOKEN }).getWriteApi(
    INFLUX_ORG,
    INFLUX_BUCKET,
    'ns'
);
const PING = new PingAPI(INFLUX);

async function start() {
    PING.getPing()
        .then(() => {
            LOG.info('InfluxDB connected');
        })
        .catch((error) => {
            LOG.warn(error);
            LOG.warn('InfluxDB is not responding');
        });
}

async function write(points) {
    let pts = points.map((p) => {
        let tags = p.tags || {};
        tags.status = p.status;

        let fields = { value: p.value };
        if (p.datatype === 'boolean') fields.value_num = p.value * 1;
        return {
            measurement: p.measurement,
            tags,
            fields,
            timestamp: p.timestamp,
        };
    });

    try {
        INFLUX.writePoints(pts);
    } catch (e) {
        if (e.message.includes('partial write')) {
            LOG.warn(e.message);
            return;
        }
        LOG.error(e.message);
        throw e;
    }
}
export default { start, write };
