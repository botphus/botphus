/**
 * System code
 */
export enum SystemCode {
    'SUCCESS'= 200,
    'FORBIDDEN' = 403,
    'NOT_FOUND' = 404,
    'ERROR' = 110, // Valid Error
    'MONGO_ERROR' = 111,
    'MONGO_UNIQUE_ERROR' = 11000,
    'REDIS_ERROR' = 112,
    'UNKNOWN_ERROR' = 500,
}
