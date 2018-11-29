import {model, Schema} from 'mongoose';
import * as validate from 'mongoose-validator';

import {localePkg} from '../modules/util';
import {modifyDate} from './base_model';

import {IUnionTaskFlowModel} from '../interfaces/model';
import {strLength} from '../types/rules';

const localeUnionTaskFlowPkg = localePkg.Model.UnionTaskFlow;

const schema = new Schema({
    createdUser: {
        type: Schema.Types.ObjectId
    },
    excludeTask: {
        required: [true, `${localeUnionTaskFlowPkg.excludeTask}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.Mixed
    },
    mysqlId: {
        type: Schema.Types.ObjectId
    },
    name: {
        required: [true, `${localeUnionTaskFlowPkg.name}: ${localePkg.Model.requiredError}`],
        type: String,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeUnionTaskFlowPkg.name}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    redisId: {
        type: Schema.Types.ObjectId
    },
    status: {
        required: [true, `${localeUnionTaskFlowPkg.status}: ${localePkg.Model.requiredError}`],
        type: Number
    },
    suffixDomain: {
        type: String,
        validate: [
            validate({
                arguments: strLength,
                message: `${localeUnionTaskFlowPkg.suffixDomain}: ${localePkg.Model.lengthError}`,
                validator: 'isLength',
            })
        ]
    },
    unionTaskId: {
        required: [true, `${localeUnionTaskFlowPkg.unionTaskId}: ${localePkg.Model.requiredError}`],
        type: Schema.Types.ObjectId
    }
});

schema.plugin(modifyDate);
schema.index({unionTaskId: -1});

/* tslint:disable:variable-name */
export const UnionTaskFlow = model<IUnionTaskFlowModel>('BP_UnionTaskFlow', schema);
