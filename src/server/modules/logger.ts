import {ensureDirSync} from 'fs-extra';
import {join} from 'path';
import * as pino from 'pino';

import config from './config';
import {createMD5Sign} from './util';

let reqIdCount = 0;
const reqIdmaxInt = 100000;

// Set default pretty config
const prettyConf: pino.PrettyOptions = {
    forceColor: true,
    /**
     * For pino-pretty setting
     */
    // @ts-ignore
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss'
};

// Set logger config
const loggerConf: pino.LoggerOptions = {
    level: config.logLevel,
    prettyPrint: config.logPretty ? prettyConf : false
};

// Set logger instance
let logger: pino.Logger;
if (config.logType === 'file') {
    ensureDirSync(config.logPath);
    // For pino 5.7 new method
    // @ts-ignore
    logger = pino(loggerConf, pino.destination(join(config.logPath, 'log.log')));
} else {
    // @ts-ignore
    logger = pino(loggerConf);
}

// Set req ID generator
logger.genReqId = () => {
    const reqId = createMD5Sign(`${reqIdCount}:${new Date().getTime()}}`, 'reqId');
    reqIdCount ++;
    // Loop id count
    if (reqIdCount === reqIdmaxInt) {
        reqIdCount = 0;
    }
    return reqId;
};

export default logger;
