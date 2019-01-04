import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {ITaskModel} from '../interfaces/model';
import {strLength} from '../types/rules';

const localeTaskPkg = localePkg.Model.Task;

const schema = new Schema({
    createdUser: {
        required: [true, `${localePkg.Model.Common.createdUser}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.ObjectId
    },
    members: {
        type: [Schema.Types.ObjectId]
    },
    name: {
        required: [true, `${localeTaskPkg.name}: ${localePkg.Model.requiredError}`],
        type: String,
        unique: true,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeTaskPkg.name}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    pageType: {
        required: [true, `${localeTaskPkg.pageType}: ${localePkg.Model.requiredError}`],
        type: Number
    },
    ruleItems: {
        required: [true, `${localeTaskPkg.ruleItems}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.Mixed
    },
    status: {
        default: 1,
        type: Number
    },
    userGroupId: {
        type: Schema.Types.ObjectId
    },
});

schema.plugin(modifyDate);

/* tslint:disable:variable-name */
export const Task = model<ITaskModel>('BP_Task', schema);
