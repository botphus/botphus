import {model, Schema} from 'mongoose';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {ITaskReportModel} from '../interfaces/model';

const localeTaskReportPkg = localePkg.Model.TaskReport;

const schema = new Schema({
    context: {
        type: String
    },
    flowId: {
        type: Schema.Types.ObjectId
    },
    index: {
        required: [true, `${localeTaskReportPkg.index}: ${localePkg.Model.requiredError}`],
        type: String
    },
    message: {
        type: String
    },
    receiveData: {
        type: String
    },
    status: {
        required: [true, `${localeTaskReportPkg.status}: ${localePkg.Model.requiredError}`],
        type: Number
    },
    type: {
        type: Number
    }
});

schema.plugin(modifyDate);
schema.index({flowId: 1});

/* tslint:disable:variable-name */
export const TaskReport = model<ITaskReportModel>('BP_TaskReport', schema);
