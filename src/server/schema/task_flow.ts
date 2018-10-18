import {pageInfo} from './common';

import {strLength, urlLength} from '../types/rules';
import {TaskFlowPageType} from '../types/task';

import {getNumEnumsList} from '../modules/util';

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
        },
        pageType: {
            enum: getNumEnumsList(TaskFlowPageType).map((item) => {
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
        pageType: {
            enum: getNumEnumsList(TaskFlowPageType).map((item) => {
                return item.value;
            }),
            type: 'integer'
        },
        redisId: {
            type: 'string'
        },
        startPage: {
            maxLength: urlLength[1],
            minLength: urlLength[0],
            type: 'string'
        },
        taskId: {
            type: 'string'
        }
    },
    required: ['excludeOption', 'name', 'pageType'],
    type: 'object'
};
