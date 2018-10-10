import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {getLocale} from '../modules/util';
import {modifyDate} from './base_model';

import {IDatabaseModel} from '../interfaces/model';
import {strLength} from '../types/rules';

const localePkg = getLocale();
const localeDatabasePkg = localePkg.Model.Database;

const schema = new Schema({
    config: {
        required: [true, `${localeDatabasePkg.config}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.Mixed
    },
    name: {
        required: [true, `${localeDatabasePkg.name}: ${localePkg.Model.requiredError}`],
        type: String,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeDatabasePkg.name}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    type: {
        required: [true, `${localeDatabasePkg.type}: ${localePkg.Model.requiredError}`],
        type: Number
    }
});

schema.plugin(modifyDate);

/* tslint:disable:variable-name */
export const Database = model<IDatabaseModel>('Task', schema);
