import {modifyCommonRequiredField, modifyCommonSchema, pageInfo} from './common';

import {strLength} from '../types/rules';

/**
 * Search schema
 * @type {Object}
 */
export const searchSchema = {
    properties: Object.assign({
        name: {
            maxLength: strLength[1],
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
        members: {
            items: {
                type: 'string'
            },
            type: 'array'
        },
        name: {
            maxLength: strLength[1],
            minLength: strLength[0],
            type: 'string'
        }
    },
    required: ['name', 'members'],
    type: 'object'
};

/**
 * Modify schema
 * @type {Object}
 */
export const modifySchema = {
    properties: Object.assign({
        members: {
            items: {
                type: 'string'
            },
            type: 'array'
        },
        name: {
            maxLength: strLength[1],
            minLength: strLength[0],
            type: 'string'
        }
    }, modifyCommonSchema),
    required: modifyCommonRequiredField,
    type: 'object'
};
