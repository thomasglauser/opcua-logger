const { InfluxDB } = require('@influxdata/influxdb-client');
const { PingAPI } = require('../packages/apis');
const { url, token, org, bucket } = require('./env');
const log = require('log4js').getLogger('influx');

const INFLUX = new InfluxDB({ url, token }).getWriteApi(org, bucket, 'ns');
const PING = new PingAPI(INFLUX);

async function start() {
    PING.getPing()
        .then(() => {
            log.info('InfluxDB connected');
        })
        .catch((error) => {
            log.warn(error);
            log.warn('InfluxDB is not responding');
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
            log.warn(e.message);
            return;
        }
        log.error(e.message);
        throw e;
    }
}
module.exports = { start, write };
