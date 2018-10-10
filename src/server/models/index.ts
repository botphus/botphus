import mongoose = require('mongoose');

import config from '../modules/config';

mongoose.Promise = Promise;
mongoose.connect(config.db, {
    poolSize: 20
}, (err) => {
    if (err) {
        global.console.error('connect to %s error: ', err);
        process.exit(1);
    }
    global.console.debug('MongoDB connect succeed');
});

export * from './user';
export * from './database';
export * from './task';
export * from './task_flow';
export * from './task_report';
