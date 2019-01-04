import mongoose = require('mongoose');

import config from '../modules/config';
import {app} from '../modules/util';

import {TaskFlowStatus, TaskReportStatus} from '../types/task';

import {modifyTaskFlows} from '../services/task_flow';
import {modifyTaskReports} from '../services/task_report';
import {modifyUnionTaskFlows} from '../services/union_task_flow';

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
    // Update ongoing task flows & reports to faild
    modifyTaskFlows({
        status: TaskFlowStatus.ONGOING
    }, {
        status: TaskFlowStatus.FAILED
    });
    modifyUnionTaskFlows({
        status: TaskFlowStatus.ONGOING
    }, {
        status: TaskFlowStatus.FAILED
    });
    modifyTaskReports({
        status: TaskReportStatus.ONGOING
    }, {
        message: 'Application restart',
        status: TaskReportStatus.FAILED,
    });
});

export default mongoose;
export * from './user';
export * from './user_group';
export * from './connection';
export * from './task';
export * from './task_flow';
export * from './task_report';
export * from './union_task';
export * from './union_task_flow';
