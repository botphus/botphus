import {pageInfo} from './common';

/**
 * Search schema
 * @type {Object}
 */
export const searchSchema = {
    properties: Object.assign({
        email: {
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
    properties: {
        email: {
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
        },
        userId: {
            type: 'string'
        }
    },
    type: 'object'
};
