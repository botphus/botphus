import {TaskType} from '../types/task';

import {modifyCommonRequiredField, modifyCommonSchema, pageInfo} from './common';

import {strLength} from '../types/rules';
import {TaskPageType} from '../types/task';

import {app, getNumEnumsList} from '../modules/util';

app.addSchema({
    $id: 'taskRuleItems',
    items: {
        properties: {
            arguments: {
                type: 'array'
            },
            assertion: {
                items: {
                    type: 'string'
                },
                type: 'array'
            },
            assertionVarName: {
                type: 'string'
            },
            id: {
                type: 'integer'
            },
            name: {
                maxLength: strLength[1],
                minLength: strLength[0],
                type: 'string'
            },
            pid: {
                type: 'integer'
            },
            subType: {
                type: 'integer'
            },
            type: {
                enum: getNumEnumsList(TaskType).map((item) => {
                    return item.value;
                }),
                type: 'integer'
            },
        },
        required: ['name', 'type', 'id'],
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
        },
        pageType: {
            enum: getNumEnumsList(TaskPageType).map((item) => {
                return item.value;
            }),
            type: 'integer'
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
    pageType: {
        enum: getNumEnumsList(TaskPageType).map((item) => {
            return item.value;
        }),
        type: 'integer'
    },
    ruleItems: 'taskRuleItems#'
};

/**
 * Create schema
 * @type {Object}
 */
export const createSchema = {
    properties: baseProperties,
    required: ['name', 'ruleItems', 'pageType'],
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
