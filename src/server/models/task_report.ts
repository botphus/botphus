import {model, Schema} from 'mongoose';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {ITaskReportModel} from '../interfaces/model';

const localeTaskReportPkg = localePkg.Model.TaskReport;

const schema = new Schema({
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
    success: {
        required: [true, `${localeTaskReportPkg.success}: ${localePkg.Model.requiredError}`],
        type: Boolean
    }
});

schema.plugin(modifyDate);
schema.index({flowId: 1});

/* tslint:disable:variable-name */
export const TaskReport = model<ITaskReportModel>('TaskReport', schema);
