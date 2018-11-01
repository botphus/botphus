import {modifyCommonSchema, pageInfo} from './common';

import {emailLength, strLength} from '../types/rules';

/**
 * Search schema
 * @type {Object}
 */
export const searchSchema = {
    properties: Object.assign({
        email: {
            format: 'email',
            maxLength: emailLength[1],
            minLength: emailLength[0],
            type: 'string'
        },
        enable: {
            type: 'boolean'
        },
        nickname: {
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
        email: {
            format: 'email',
            maxLength: emailLength[1],
            minLength: emailLength[0],
            type: 'string'
        },
        nickname: {
            maxLength: strLength[1],
            minLength: strLength[0],
            type: 'string'
        },
        password: {
            maxLength: strLength[1],
            minLength: strLength[0],
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
            maxLength: emailLength[1],
            minLength: emailLength[0],
            type: 'string'
        },
        password: {
            maxLength: strLength[1],
            minLength: strLength[0],
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
            maxLength: emailLength[1],
            minLength: emailLength[0],
            type: 'string'
        },
        enable: {
            type: 'boolean'
        },
        nickname: {
            maxLength: strLength[1],
            minLength: strLength[0],
            type: 'string'
        },
        password: {
            maxLength: strLength[1],
            minLength: strLength[0],
            type: 'string'
        },
        permission: {
            type: 'integer'
        }
    }, modifyCommonSchema),
    type: 'object'
};
