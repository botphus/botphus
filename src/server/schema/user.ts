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
            type: 'number'
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
            type: 'number'
        },
        userId: {
            type: 'string'
        }
    },
    type: 'object'
};
