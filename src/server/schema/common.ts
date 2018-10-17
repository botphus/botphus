import config from '../modules/config';

/**
 * List query page info
 * @type {Object}
 */
export const pageInfo = {
    page: {
        minimum: 1,
        type: 'integer'
    },
    pageSize: {
        maximum: config.maxPageSize,
        minimum: config.pageSize,
        type: 'integer'
    }
};

/**
 * Query detail schema
 * @type {Object}
 */
export const queryDetailSchema = {
    properties: {
        id: {
            type: 'string'
        }
    },
    type: 'object'
};

/**
 * Modify schema
 * @type {Object}
 */
export const modifyCommonSchema = {
    modifyId: {
        type: 'string'
    }
};

export const modifyCommonRequiredField = ['modifyId'];
