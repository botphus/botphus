import {pageInfo} from './common';

import {strLength} from '../types/rules';

import {TaskFlowStatus} from '../types/task';

import {getNumEnumsList} from '../modules/util';

/**
 * Search schema
 * @type {Object}
 */
export const searchSchema = {
    properties: Object.assign({
        name: {
            maxLength: strLength[1],
            type: 'string'
        },
        status: {
            enum: getNumEnumsList(TaskFlowStatus).map((item) => {
                return item.value;
            }),
            type: 'integer'
        }
    }, pageInfo),
    type: 'object'
};

/**
 * Create schema
 * @type {Object}
 */
export const createSchema = {
    properties: {
        excludeTask: {
            additionalProperties: {
                type: 'boolean'
            },
            type: 'object'
        },
        mysqlId: {
            type: 'string'
        },
        name: {
            maxLength: strLength[1],
            minLength: strLength[0],
            type: 'string',
        },
        redisId: {
            type: 'string'
        },
        suffixDomain: {
            maxLength: strLength[1],
            type: 'string'
        },
        unionTaskId: {
            type: 'string'
        }
    },
    required: ['excludeTask', 'name', 'unionTaskId'],
    type: 'object'
};
