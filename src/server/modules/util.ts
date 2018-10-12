import {createHmac} from 'crypto';
import * as fastify from 'fastify';

import config from './config';
import logger from './logger';

import {IHttpErrorMessage, ISystemError} from '../interfaces/common';
import ILocalePackage from '../interfaces/locale';
import {SystemCode} from '../types/common';
/**
 * Disable require limit
 */
/* tslint:disable */
export const localePkg: ILocalePackage = require(`../locale/${config.locale}`).default;
/* tslint:enable */
export const app = fastify({
    logger
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
 * Get http error message
 * @param  {ISystemError}      err Error
 * @return {IHttpErrorMessage}     Error message
 */
export function getHttpErrorMsg(err: ISystemError): IHttpErrorMessage {
    const systemCodePkg = localePkg.SystemCode;
    let code = err.code || SystemCode.UNKNOWN_ERROR;
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
        message = systemCodePkg.unknownError;
        // Save error log
        app.log.error(err);
        break;
    case SystemCode.MONGO_ERROR:
        if (err.errors) {
            const errorName = Object.keys(err.errors)[0];
            if (err.errors[errorName].name === 'CastError') {
                message = systemCodePkg.mongoCastError;
            } else {
                message = err.errors[errorName].message;
            }
        }
        break;
    case SystemCode.MONGO_UNIQUE_ERROR:
        code = SystemCode.MONGO_ERROR;
        message = systemCodePkg.mongoUniqueError + ':' + message.replace(/^[\S\s]+\"([\S\s]+)\"[\S\s]+$/, '$1');
        break;
    }
    return {
        code,
        message
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
