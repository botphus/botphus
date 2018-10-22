import {IFormErrorMsgLengthFields, IFormErrorMsgRequiredFields} from '../interfaces/common';

import {UserPermissionCode} from '../../../src/server/types/user';

export type IFormErrorMsgFields = IFormErrorMsgLengthFields | IFormErrorMsgRequiredFields;

export type PermissionCode = UserPermissionCode;
