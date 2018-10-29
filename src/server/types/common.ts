/**
 * System code
 */
export enum SystemCode {
    'SUCCESS'= 200,
    'FORBIDDEN' = 403,
    'NOT_FOUND' = 404,
    'REQUEST_TIMEOUT' = 408,
    'ROUTINE_ERROR' = 110, // Routine error
    'MONGO_ERROR' = 111,
    'MONGO_UNIQUE_ERROR' = 11000,
    'REDIS_ERROR' = 112,
    'UNKNOWN_ERROR' = 500,
}

export const defaultPageSize = 10;

/* tslint:disable:object-literal-sort-keys */
/**
 * Close body data escape
 */
export const closeBodyEscapeMap: {
    [index: string]: true
} = {
    'post:/api/task/': true,
    'patch:/api/task/': true,
};
/* tslint:enable:object-literal-sort-keys */
