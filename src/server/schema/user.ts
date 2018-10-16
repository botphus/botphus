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
