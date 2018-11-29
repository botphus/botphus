import {pageInfo} from './common';

import {strLength, urlLength} from '../types/rules';

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
        excludeOption: {
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
        startPage: {
            maxLength: urlLength[1],
            type: 'string'
        },
        taskId: {
            type: 'string'
        }
    },
    required: ['excludeOption', 'name', 'taskId'],
    type: 'object'
};
