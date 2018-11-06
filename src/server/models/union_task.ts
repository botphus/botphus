import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {IUnionTaskModel} from '../interfaces/model';
import {strLength} from '../types/rules';

const localeTaskPkg = localePkg.Model.UnionTask;

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
    taskItems: {
        required: [true, `${localeTaskPkg.taskItems}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.Mixed
    }
});

schema.plugin(modifyDate);

/* tslint:disable:variable-name */
export const UnionTask = model<IUnionTaskModel>('BP_UnionTask', schema);
