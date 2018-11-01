import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {IUserModel} from '../interfaces/model';
import {emailLength, strLength} from '../types/rules';

const localeUserPkg = localePkg.Model.User;

const schema = new Schema({
    email: {
        required: [true, `${localeUserPkg.email}: ${localePkg.Model.requiredError}`],
        type: String,
        unique: true,
        validate: [
            validate({
                arguments: emailLength,
                message: `${localeUserPkg.email}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            }),
            validate({
                message: `${localeUserPkg.email}: ${localePkg.Model.formatError}`,
                validator: 'isEmail'
            })
        ]
    },
    enable: {
        default: true,
        type: Boolean
    },
    nickname: {
        required: [true, `${localeUserPkg.nickname}: ${localePkg.Model.requiredError}`],
        type: String,
        unique: true,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeUserPkg.nickname}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    password: {
        required: [true, `${localeUserPkg.password}: ${localePkg.Model.requiredError}`],
        type: String,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeUserPkg.nickname}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    permission: {
        default: 0,
        min: [0, `${localeUserPkg.permission}: ${localePkg.Model.numberMinError}`],
        required: [true, `${localeUserPkg.permission}: ${localePkg.Model.requiredError}`],
        type: Number
    }
});

schema.plugin(modifyDate);
schema.index({email: 1});

/* tslint:disable:variable-name */
export const User = model<IUserModel>('BP_User', schema);
