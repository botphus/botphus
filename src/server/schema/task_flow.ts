import {pageInfo} from './common';

import {strLength, urlLength} from '../types/rules';

/**
 * Search schema
 * @type {Object}
 */
export const searchSchema = {
    properties: Object.assign({
        name: {
            maxLength: strLength[1],
            minLength: strLength[0],
            type: 'string'
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
