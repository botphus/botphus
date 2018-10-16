import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {IConnectionModel} from '../interfaces/model';
import {strLength} from '../types/rules';

const localeConnectionPkg = localePkg.Model.Connection;

const schema = new Schema({
    config: {
        required: [true, `${localeConnectionPkg.config}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.Mixed
    },
    name: {
        required: [true, `${localeConnectionPkg.name}: ${localePkg.Model.requiredError}`],
        type: String,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeConnectionPkg.name}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    type: {
        required: [true, `${localeConnectionPkg.type}: ${localePkg.Model.requiredError}`],
        type: Number
    }
});

schema.plugin(modifyDate);

/* tslint:disable:variable-name */
export const Connection = model<IConnectionModel>('Connection', schema);
