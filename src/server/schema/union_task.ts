import {modifyCommonRequiredField, modifyCommonSchema, pageInfo} from './common';

import {strLength} from '../types/rules';

import {app} from '../modules/util';

app.addSchema({
    $id: 'taskItems',
    items: {
        properties: {
            ignoreError: {
                type: 'boolean'
            },
            name: {
                maxLength: strLength[1],
                minLength: strLength[0],
                type: 'string'
            },
            startPage: {
                type: 'string'
            },
            taskId: {
                type: 'string'
            },
            taskPid: {
                type: 'string'
            }
        },
        required: ['taskId', 'name', 'ignoreError'],
        type: 'object'
    },
    type: 'array'
});

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
 * Base props
 * @type {Object}
 */
const baseProperties = {
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
    },
    taskItems: 'taskItems#'
};

/**
 * Create schema
 * @type {Object}
 */
export const createSchema = {
    properties: baseProperties,
    required: ['name', 'taskItems'],
    type: 'object'
};

/**
 * Modify schema
 * @type {Object}
 */
export const modifySchema = {
    properties: Object.assign({}, baseProperties, modifyCommonSchema),
    required: modifyCommonRequiredField,
    type: 'object'
};
