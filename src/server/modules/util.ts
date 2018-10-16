import {createHmac} from 'crypto';
import * as fastify from 'fastify';

import config from './config';
import logger from './logger';

import {IAppRequest, IHttpResponseMessage, ISystemError} from '../interfaces/common';
import ILocalePackage from '../interfaces/locale';
import {SystemCode} from '../types/common';
import {UserPermissionCode} from '../types/user';

/**
 * Disable require limit
 */
/* tslint:disable */
export const localePkg: ILocalePackage = require(`../locale/${config.locale}`).default;
/* tslint:enable */
export const app = fastify({
    logger: config.logType === 'close' ? false : logger
});

/**
 * Create MD5 sign with string
 * @param  {string} text   Text
 * @param  {string} secret Secret string
 * @return {string}        Result string
 */
export function createMD5Sign(text: string, secret: string): string {
    return createHmac('md5', secret)
        .update(text)
        .digest('hex');
}

/**
 * Translate password with config server salt
 * @param  {string} password Password string
 * @return {string}          Result string
 */
export function translatePassword(password: string): string {
    return createMD5Sign(password, config.serverSalt);
}

/**
 * Replace Sensitive fields value for log
 * @param  {object} data Data info
 * @return {string}      Log string
 */
export function filterSensitiveFields(data: object): string {
    const result = JSON.stringify(data);
    return result.replace(/"(email|password)":"([^"]{2})[^"]+([^"]{2})"/ig, '"$1":"$2****$3"');
}

/**
 * Create a system error
 * @param  {string}        message Error message
 * @param  {SystemCode}    code    Error code
 * @return {ISystemError}          System error instance
 */
export function createSystemError(message: string, code: SystemCode = SystemCode.UNKNOWN_ERROR): ISystemError {
    const err: ISystemError = new Error(message);
    err.code = code;
    return err;
}

/**
 * Escape dangerous character
 * @param  {string} str String
 * @return {string}     Escaped string
 */
export function escapeCharacter(str: string): string {
    let replacedStr = str.trim(); // 去除前后空格
    replacedStr = str.replace(/[<>'"\\]/g, (e: string) => {
        return '&#' + e.charCodeAt(0) + ';';
    });
    return replacedStr;
}

/**
 * Escape dangerous data
 * @param  {any} data Data
 * @return {any}      Escaped data
 */
export function escapeData(data: any): any {
    // Check array
    if (Array.isArray(data)) {
        return data.map(escapeData);
    }
    switch (typeof data) {
        case 'object': {
            Object.keys(data).forEach((key) => {
                data[key] = escapeData(data[key]);
            });
            break;
        }
        case 'string':
            return escapeCharacter(data);
    }
    return data;
}

/**
 * Create/rewrite page info
 * @param {IAppRequest} request request
 */
export function buildPageInfo(request: IAppRequest) {
    request.query.page = parseInt(request.query.page, 10);
    request.query.pageSize = parseInt(request.query.pageSize, 10);
    if (!request.query.page || request.query.page < 0) {
        request.query.page = 1;
    }
    if (!request.query.pageSize || request.query.pageSize > config.maxPageSize) {
        request.query.pageSize = config.pageSize;
    }
}

/**
 * Get http message
 * @param  {IAppRequest}          request  Request
 * @param  {any}                  data     Send data
 * @param  {string}               message  Message
 * @return {IHttpResponseMessage}          Return message
 */
export function getHttpMsg(request: IAppRequest, data: any, message: string = localePkg.SystemCode.success): IHttpResponseMessage {
    return {
        code: SystemCode.SUCCESS,
        // Check list data
        data: Array.isArray(data) ? {
            content: data[1],
            page: request.query.page,
            pageSize: request.query.pageSize,
            total: data[0]
        } : data,
        message,
        rid: request.id
    };
}

/**
 * Get http error message
 * @param  {ISystemError}         err Error
 * @return {IHttpResponseMessage}     Error message
 */
/**
 * Get http error message
 * @param  {IAppRequest}          request Request
 * @param  {ISystemError}         err     Error
 * @return {IHttpResponseMessage}         Error message
 */
export function getHttpErrorMsg(request: IAppRequest, err: ISystemError): IHttpResponseMessage {
    const systemCodePkg = localePkg.SystemCode;
    let code = err.code || (err.name !== 'Error' ? SystemCode.MONGO_ERROR : SystemCode.UNKNOWN_ERROR); // Default code > Mongo error > unknown
    let message = err.message || err.stack;
    // Set Not Found
    if (err.message === 'Not Found') {
        code = SystemCode.NOT_FOUND;
    }
    // Get code message
    switch (code) {
    case SystemCode.NOT_FOUND:
        message = systemCodePkg.notFound;
        break;
    case SystemCode.UNKNOWN_ERROR:
        // Schema error
        if (err.validation) {
            code = SystemCode.ROUTINE_ERROR;
            const curValidMsg = err.validation[0];
            switch (curValidMsg.keyword) {
                case 'type':
                    message = localePkg.Schema.typeError;
                    break;
                case 'required':
                    message = localePkg.Schema.requiredError;
                default:
                    message = localePkg.Schema.commonError;
            }
        } else {
            message = systemCodePkg.unknownError;
            // Save error log
            app.log.error(err);
        }
        break;
    case SystemCode.MONGO_ERROR:
        if (err.errors) {
            const errorField = Object.keys(err.errors)[0];
            if (err.errors[errorField].name === 'CastError') {
                message = systemCodePkg.mongoCastError;
            } else {
                message = err.errors[errorField].message;
            }
        } else {
            message = err.message;
        }
        break;
    case SystemCode.MONGO_UNIQUE_ERROR:
        code = SystemCode.MONGO_ERROR;
        message = localePkg.SystemCode.mongoUniqueError + ':' + message.replace(/^[\S\s]+\"([\S\s]+)\"[\S\s]+$/, '$1');
        break;
    }
    return {
        code,
        data: null,
        message,
        rid: request.id
    };
}

/**
 * Check empty object
 * @param  {any}     obj Object
 * @return {boolean}     Is or not
 */
export function isObjEmpty(obj: any): boolean {
    // Speed up calls to hasOwnProperty
    const hasOwnProperty = Object.prototype.hasOwnProperty;

    // null and undefined are "empty"
    if (obj == null) {
        return true;
    }

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== 'object') {
        return true;
    }

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) {
        return false;
    }
    if (obj.length === 0) {
        return true;
    }

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (const key in obj) {
        if (hasOwnProperty.call(obj, key)) {
            return false;
        }
    }

    return true;
}

/**
 * Check user's permission
 * @param  {number}             userPermission User's permission
 * @param  {UserPermissionCode} permissionCode Permission code
 * @return {boolean}                           Pass or not
 */
export function checkUserPermission(userPermission: number, permissionCode: UserPermissionCode): boolean {
    return (userPermission & permissionCode) > 0;
}
