import mongoose = require('mongoose');

import config from '../modules/config';
import {app} from '../modules/util';

mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;
mongoose.connect(config.db, {
    poolSize: 20,
    useNewUrlParser: true
}, (err) => {
    if (err) {
        app.log.error(err);
        app.close(() => {
            setTimeout(() => {
                process.exit(1);
            }, 100);
        });
    }
    app.log.debug('MongoDB connect succeed');
});

export default mongoose;
export * from './user';
export * from './connection';
export * from './task';
export * from './task_flow';
export * from './task_report';
