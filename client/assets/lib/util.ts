import {PaginationConfig} from 'antd/lib/pagination';
import md5 from 'blueimp-md5';

import {IIndexMap, INumEnumValue} from '../interfaces/common';
import {IContentData} from '../interfaces/redux';
import {UserPermissionCode} from '../types/common';

import {salt} from './const';

// Get app DOM
export const $app: HTMLElement = document.getElementById('app') || document.body;

// Export log function
export const log = console;

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
export function checkUserPermission(userPermission: number = 0, permissionCode: UserPermissionCode): boolean {
    return (userPermission & permissionCode) > 0;
}

/**
 * Get page data
 * @param  {IContentData}     data Content Data
 * @return {PaginationConfig}      Page config
 */
export function getPageData(data: IContentData): PaginationConfig {
    return {
        current: data.page,
        pageSize: data.pageSize,
        pageSizeOptions: ['10', '50', '100'],
        showSizeChanger: true,
        total: data.total,
    };
}

/**
 * Get number enums list
 * @param  {Object}          enums Enums value
 * @return {INumEnumValue[]}       Enum List
 */
export function getNumEnumsList(enums: any): INumEnumValue[] {
    return Object.keys(enums).filter((key) => {
        return isNaN(parseInt(key, 10));
    }).map((key) => {
        return {
            key,
            value: enums[key]
        };
    });
}

/**
 * Filter empty field
 * @param  {object} data Filter data
 * @return {any}         Filtered data
 */
export function filterEmptyFields(data: object): any {
    const returnData = {...data};
    for (const key in data) {
        if (typeof data[key] !== 'number' && typeof data[key] !== 'boolean' && !data[key]) {
            delete returnData[key];
        }
    }
    return returnData;
}

/**
 * Parse location search to query map
 * @param  {string}            search Search sting
 * @return {IIndexMap<string>}        Query map
 */
export function parseLocationSearch(search: string): IIndexMap<string> {
    const query: IIndexMap<string> = {};
    if (search) {
        const matchData = search.match(/[^\?&]+=[^\?&]+/g);
        if (matchData) {
            matchData.forEach((queryString) => {
                const [queryIndex, queryData] = queryString.split('=');
                query[queryIndex] = queryData;
            });
        }
    }
    return query;
}

/**
 * Sort Items
 * - T: List interface
 * - I: Drop/Drag index key type
 * @param {T[]}     items        Sort item list
 * @param {keyof T} fieldKey     Sort field key
 * @param {number}  dropPosition Drop postion info: before: dropPosition = -1, inset: dropPosition = 0, after: dropPosition = 1
 * @param {I}       dropKey      Drop key value
 * @param {I}       dragKey      Drag key value
 * @return {T[]}                 Return list
 */
export function sortItems<T, I>(items: T[], fieldKey: keyof T, dropPosition: number, dropKey: I, dragKey: I): T[] {
    let list: T[] = [];
    let dropIndex: number = -1;
    let dragIndex: number = -1;
    items.some(((item, index) => {
        const key: any = item[fieldKey];
        if (dropIndex === -1 && key === dropKey) {
            dropIndex = index;
        }
        if (dragIndex === -1 && key === dragKey) {
            dragIndex = index;
        }
        return dropIndex >= 0 && dragIndex >= 0;
    }));
    const beforeDropArray = items.slice(0, dropIndex < dragIndex ? dropIndex : dragIndex);
    const dropItem = items.slice(dropIndex, dropIndex + 1);
    const inDropAndDragArray = dropIndex < dragIndex ? items.slice(dropIndex + 1, dragIndex) : items.slice(dragIndex + 1, dropIndex);
    const dragItem = items.slice(dragIndex, dragIndex + 1);
    const afterDragArray = items.slice(dropIndex < dragIndex ? dragIndex + 1 : dropIndex + 1);
    switch (dropPosition) {
        case -1: // Before
            if (dropIndex < dragIndex) {
                list = beforeDropArray.concat(dragItem, dropItem, inDropAndDragArray, afterDragArray);
            } else {
                list = beforeDropArray.concat(inDropAndDragArray, dragItem, dropItem, afterDragArray);
            }
            break;
        default: // After
            if (dropIndex < dragIndex) {
                list = beforeDropArray.concat(dropItem, dragItem, inDropAndDragArray, afterDragArray);
            } else {
                list = beforeDropArray.concat(inDropAndDragArray, dropItem, dragItem, afterDragArray);
            }
            break;
    }
    return list;
}
