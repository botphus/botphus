import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {ITaskFlowModel} from '../interfaces/model';
import {strLength, urlLength} from '../types/rules';

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
    name: {
        required: [true, `${localeTaskFlowPkg.name}: ${localePkg.Model.requiredError}`],
        type: String,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeTaskFlowPkg.name}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    redisId: {
        type: Schema.Types.ObjectId
    },
    startPage: {
        type: String,
        validate: [
            validate({
                message: `${localeTaskFlowPkg.startPage}: ${localePkg.Model.urlError}`,
                validator: 'isURL',
            }),
            validate({
                arguments: urlLength,
                message: `${localeTaskFlowPkg.startPage}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    status: {
        required: [true, `${localeTaskFlowPkg.status}: ${localePkg.Model.requiredError}`],
        type: Number
    },
    taskId: {
        required: [true, `${localeTaskFlowPkg.taskId}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.ObjectId
    }
});

schema.plugin(modifyDate);
schema.index({taskId: -1});

/* tslint:disable:variable-name */
export const TaskFlow = model<ITaskFlowModel>('BP_TaskFlow', schema);
