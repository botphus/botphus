import {modifyCommonRequiredField, modifyCommonSchema, pageInfo} from './common';

/**
 * Search schema
 * @type {Object}
 */
export const searchSchema = {
    properties: Object.assign({
        email: {
            format: 'email',
            type: 'string'
        },
        enable: {
            type: 'string'
        },
        nickname: {
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
        email: {
            format: 'email',
            type: 'string'
        },
        nickname: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        permission: {
            type: 'integer'
        }
    },
    required: ['email', 'nickname', 'password'],
    type: 'object'
};

/**
 * Login schema
 * @type {Object}
 */
export const loginSchema = {
    properties: {
        email: {
            format: 'email',
            type: 'string'
        },
        password: {
            type: 'string'
        }
    },
    required: ['email', 'password'],
    type: 'object'
};

/**
 * Modify schema
 * @type {Object}
 */
export const modifySchema = {
    properties: Object.assign({
        email: {
            format: 'email',
            type: 'string'
        },
        enable: {
            type: 'boolean'
        },
        nickname: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        permission: {
            type: 'integer'
        }
    }, modifyCommonSchema),
    required: modifyCommonRequiredField,
    type: 'object'
};
