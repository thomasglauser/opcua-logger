require('dotenv').config();

const { InfluxDB } = require('@influxdata/influxdb-client');
const { PingAPI } = require('@influxdata/influxdb-client-apis');

const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_ORG = process.env.INFLUX_ORG;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET;

const LOG = require('log4js').getLogger('influx');

const INFLUX = new InfluxDB({
    url: INFLUX_URL,
    token: INFLUX_TOKEN,
}).getWriteApi(INFLUX_ORG, INFLUX_BUCKET, 'ns');

const INFLUX_API = new PingAPI(INFLUX);

async function start() {
    INFLUX_API.getPing()
        .then(() => {
            LOG.info('Successfully connected to InfluxDB');
        })
        .catch((error) => {
            LOG.error('Error connecting to InfluxDB: ' + error.message);
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

module.exports = { start, write };
