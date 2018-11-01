import * as assert from 'power-assert';

import {SystemCode} from '../server/types/common';
import {IRequestData} from './interfaces';

import {localePkg} from '../server/modules/util';

/**
 * [assertResMessage description]
 * @param {IRequestData} res [description]
 */
export function assertResMessage(res: IRequestData, code: SystemCode = SystemCode.SUCCESS, message: string = localePkg.SystemCode.success) {
    assert(res.body.rid);
    assert(res.body.code === code);
    assert(res.body.message === message);
}
