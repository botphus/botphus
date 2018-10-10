import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {getLocale} from '../modules/util';
import {modifyDate} from './base_model';

import {strLength} from '../enums/rules';
import {ITaskModel} from '../interfaces/model';

const localePkg = getLocale();
const localeTaskPkg = localePkg.Model.Task;

const schema = new Schema({
    createdUser: {
        type: Schema.Types.ObjectId
    },
    items: {
        required: [true, `${localeTaskPkg.items}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.Mixed
    },
    memebers: {
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
    }
});

schema.plugin(modifyDate);
schema.index({name: 1});

/* tslint:disable:variable-name */
export const Task = model<ITaskModel>('Task', schema);
