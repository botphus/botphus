import {modifyCommonRequiredField, modifyCommonSchema, pageInfo} from './common';

import {ConnectionType} from '../types/connection';
import {strLength} from '../types/rules';

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
        type: {
            type: 'integer'
        }
    }, pageInfo),
    type: 'object'
};

/**
 * Config list for oneof
 * @type {Array}
 */
const configItemList = [
    // Mysql
    {
        properties: {
            database: {
                type: 'string'
            },
            host: {
                type: 'string'
            },
            password: {
                maxLength: strLength[1],
                type: 'string'
            },
            port: {
                type: 'number'
            },
            user: {
                maxLength: strLength[1],
                minLength: strLength[0],
                type: 'string'
            }
        },
        required: ['database', 'host', 'user', 'port'],
        type: 'object'
    },
    // Redis
    {
        properties: {
            host: {
                type: 'string'
            },
            port: {
                type: 'number'
            }
        },
        required: ['host', 'port'],
        type: 'object'
    },
    // Redis cluster
    {
        items: {
            properties: {
                host: {
                    type: 'string'
                },
                port: {
                    type: 'number'
                }
            },
            required: ['host', 'port'],
            type: 'object'
        },
        type: 'array'
    }
];

/**
 * Base props
 * @type {Object}
 */
const baseProperties = {
    config: {
        anyOf: configItemList,
    },
    name: {
        maxLength: strLength[1],
        minLength: strLength[0],
        type: 'string'
    },
    type: {
        enum: getNumEnumsList(ConnectionType).map((item) => {
            return item.value;
        }),
        type: 'integer'
    }
};

/**
 * Create schema
 * @type {Object}
 */
export const createSchema = {
    properties: baseProperties,
    required: ['name', 'type', 'config'],
    type: 'object'
};

/**
 * Modify schema
 * @type {Object}
 */
export const modifySchema = {
    properties: Object.assign({}, baseProperties, modifyCommonSchema),
    required: ['type', 'config'].concat(modifyCommonRequiredField),
    type: 'object'
};
