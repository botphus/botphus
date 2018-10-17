import {modifyCommonRequiredField, modifyCommonSchema, pageInfo} from './common';

import {ConnectionType} from '../types/connection';

import {getNumEnumsList} from '../modules/util';

/**
 * Search schema
 * @type {Object}
 */
export const searchSchema = {
    properties: Object.assign({
        name: {
            type: 'string'
        },
        type: {
            type: 'string'
        }
    }, pageInfo),
    type: 'object'
};

/**
 * Config list for oneof
 * @type {Array}
 */
const configList = [
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
                type: 'string'
            },
            user: {
                type: 'string'
            }
        },
        required: ['database', 'host', 'user'],
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
 * Create props
 * @type {Object}
 */
const baseProperties = {
    config: {
        oneOf: configList,
    },
    name: {
        type: 'string'
    },
    type: {
        enum: getNumEnumsList(ConnectionType).map((item) => {
            return item.value;
        }),
        type: 'integer'
    }
};

export const createSchema = {
    properties: baseProperties,
    required: ['name', 'type', 'config'],
    type: 'object'
};

export const modifySchema = {
    properties: Object.assign({}, baseProperties, modifyCommonSchema),
    required: ['name', 'type', 'config'].concat(modifyCommonRequiredField),
    type: 'object'
};
