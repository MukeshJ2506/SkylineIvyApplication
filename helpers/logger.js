var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: 'error-log',
    streams: [{
        type: 'rotating-file',
        path: 'log/error-log.log',
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }]
});
module.exports = log;