import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {IUserGroupModel} from '../interfaces/model';
import {strLength} from '../types/rules';

const localeUserGroupPkg = localePkg.Model.UserGroup;

const schema = new Schema({
    members: {
        type: [Schema.Types.ObjectId]
    },
    name: {
        required: [true, `${localeUserGroupPkg.name}: ${localePkg.Model.requiredError}`],
        type: String,
        unique: true,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeUserGroupPkg.name}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
});

schema.plugin(modifyDate);

/* tslint:disable:variable-name */
export const UserGroup = model<IUserGroupModel>('BP_UserGroup', schema);
