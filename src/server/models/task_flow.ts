import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {getLocale} from '../modules/util';
import {modifyDate} from './base_model';

import {ITaskFlowModel} from '../interfaces/model';
import {urlLength} from '../types/rules';

const localePkg = getLocale();
const localeTaskFlowPkg = localePkg.Model.TaskFlow;

const schema = new Schema({
    createdUser: {
        type: Schema.Types.ObjectId
    },
    excludeOption: {
        required: [true, `${localeTaskFlowPkg.excludeOption}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.Mixed
    },
    mysqlId: {
        type: Schema.Types.ObjectId
    },
    pageType: {
        required: [true, `${localeTaskFlowPkg.pageType}: ${localePkg.Model.requiredError}`],
        type: Number
    },
    redisId: {
        type: Schema.Types.ObjectId
    },
    startPage: {
        required: [true, `${localeTaskFlowPkg.startPage}: ${localePkg.Model.requiredError}`],
        type: String,
        validate: [
            validate({
                message: `${localeTaskFlowPkg.startPage}: ${localePkg.Model.urlError}`,
                validator: 'isUrl',
            }),
            validate({
                arguments: urlLength,
                message: `${localeTaskFlowPkg.startPage}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    taskId: {
        required: [true, `${localeTaskFlowPkg.taskId}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.ObjectId
    }
});

schema.plugin(modifyDate);
schema.index({taskId: -1});

/* tslint:disable:variable-name */
export const TaskFlow = model<ITaskFlowModel>('TaskFlow', schema);
