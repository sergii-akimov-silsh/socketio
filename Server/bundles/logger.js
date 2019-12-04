const winston = require('winston');
const dotenv = require('dotenv').config();

const logger = new (winston.Logger)({
    transports: [
        // new winston.transports.File({filename: args.runtime + '/all-logs.log'}),
        // new (winston.transports.Console)({colorize: true, timestamp: true}),
    ],
    exceptionHandlers: [
        new winston.transports.File({filename: dotenv.parsed.SOCSOCKET_IO_LOG + '/exceptions.log'})
    ],
    exitOnError: false
});

module.exports = logger;