import md5 from 'blueimp-md5';

import {UserPermissionCode} from '../types/common';

import {salt} from './const';

// Get app DOM
export const $app: HTMLElement = document.getElementById('app') || document.body;

/**
 * Serialize query data
 * @param  {object} data Query Data
 * @return {string}      data string
 */
export function serialize(data: object): string {
    const queryList: string[] = Object.keys(data).map((key) => {
        return key + '=' + encodeURIComponent(data[key]);
    });
    return queryList.join('&');
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
 * Translate password
 * @param  {string} pwd password
 * @return {string}     translate result
 */
export function translatePwd(pwd: string): string {
    return md5(pwd, salt);
}

/**
 * Check user's permission
 * @param  {number}         userPermission User's permission
 * @param  {PermissionCode} permissionCode Permission code
 * @return {boolean}                       Pass or not
 */
export function checkUserPermission(userPermission: number, permissionCode: UserPermissionCode): boolean {
    return (userPermission & permissionCode) > 0;
}
