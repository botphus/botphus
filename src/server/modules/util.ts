import {createHmac} from 'crypto';
import config from './config';

import {ISystemError} from '../interfaces/common';
import ILocalePackage from '../interfaces/locale';
import {SystemCode} from '../types/common';

let localeData: ILocalePackage;

/**
 * Get locale language data with config locale
 * @return {ILocalePackage} Locale language package data
 */
export function getLocale(): ILocalePackage {
    if (localeData) {
        return localeData;
    }
    localeData = require(`../locale/${config.locale}`);
    return localeData;
}

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
 * @return {string}     Escape string
 */
export function escapeCharacter(str: string): string {
    let replacedStr = str.trim(); // 去除前后空格
    replacedStr = str.replace(/[<>'"\\]/g, (e: string) => {
        return '&#' + e.charCodeAt(0) + ';';
    });
    return replacedStr;
}
