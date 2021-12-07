require('dotenv').config();

const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { OrgsAPI } = require('@influxdata/influxdb-client-apis');

const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_ORG = process.env.INFLUX_ORG;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET;

const log = require('log4js').getLogger('influx');

const influxDB = new InfluxDB({
    url: INFLUX_URL,
    token: INFLUX_TOKEN,
}).getWriteApi(INFLUX_ORG, INFLUX_BUCKET, 'ns');

const influxDB_API = new OrgsAPI(influxDB);

async function start() {
    try {
        await influxDB_API.getOrgs({
            org: INFLUX_ORG,
        });

        log.info('Successfully connected to InfluxDB');
    } catch (error) {
        log.error('InfluxDB connection error: ' + error.message);
        throw error;
    }
}

async function write(points) {
    let pts = points.map((p) => {
        if (p.datatype === 'string') {
            const point = new Point(p.measurement)
                .tag('tag', p.tag)
                .stringField('value', p.value)
                .timestamp(p.timestamp);

            return point;
        }
    });

    try {
        influxDB.writePoints(pts);
    } catch (error) {
        log.error('InfluxDB write error: ' + error.message);
        throw error;
    }
}

module.exports = { start, write };
