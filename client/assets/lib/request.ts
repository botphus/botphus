import fetch from 'isomorphic-fetch';

import {IHttpResponseMessage} from '../../../src/server/interfaces/common';

import {SystemCode} from '../../../src/server/types/common';
import {RequestAction, RequestMethodType} from '../types/request';

import {isObjEmpty, serialize} from './util';

const customHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
};

export default function request(action: RequestAction, data: any = null, method: RequestMethodType = 'GET', opts: any = null) {
    let path: string = action;
    const option: any = {
        credentials: 'include',
        headers: customHeader,
        method: method || 'GET',
    };
    switch (method) {
        case 'GET':
            if (!isObjEmpty(data)) {
                path += (/\?/.test(path) ? '&' : '?') + serialize(data);
            }
            break;
        default:
        if (!isObjEmpty(data)) {
            option.body = JSON.stringify(data);
        }
    }
    return fetch(path, {
        ...option, ...opts
    })
        .then((response) => response.json())
            .then((res: IHttpResponseMessage) => {
                if (res.code !== SystemCode.SUCCESS) {
                    return Promise.reject(new Error(res.message));
                }
                return Promise.resolve(res);
            });
}
