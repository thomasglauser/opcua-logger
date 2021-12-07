const config = require('./config/config.js');
const influx = require('./services/influx.js');
const buffer = require('./services/buffer.js');
const opcua = require('./services/opcua.js');
const log = require('./services/logging.js').getLogger('main');

let conf = config.load();

// Catch all 'bad' events and try a gracefull shutdown
let shutdownSignalCount = 0;
async function gracefullShutdown(e) {
    log.fatal(e);
    shutdownSignalCount++;
    if (shutdownSignalCount > 1) return;
    await buffer.stop();
    process.exit(0);
}

opcua.EVENTS.on('connection_break', async () => {
    await gracefullShutdown('connection_break');
});
opcua.EVENTS.on('sequential_polling_errors', async () => {
    await gracefullShutdown('sequential_polling_errors');
});
process.on('SIGTERM', async () => {
    await gracefullShutdown('received SIGTERM');
});
process.on('SIGINT', async () => {
    await gracefullShutdown('received SIGINT');
});

(async () => {
    try {
        log.info(
            `Starting OPCUA-Logger v${require('../package.json').version}`
        );

        log.info('Initialising influxClient');
        await influx.start();

        log.info('Initialising buffer');
        await buffer.start(influx.write);

        log.info('Connecting OPCUA');
        await opcua.start(conf.opcua);
        opcua.EVENTS.on('points', (pts) => buffer.addPoints(pts));

        for (let m of conf.metrics) {
            opcua.addMetric(m);
        }
    } catch (e) {
        gracefullShutdown(e);
    }
})();
