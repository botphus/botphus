import {IFormErrorMsgLengthFields, IFormErrorMsgRequiredFields} from '../interfaces/common';

export {UserPermissionCode} from '../../../src/server/types/user';
export {ConnectionType} from '../../../src/server/types/connection';

export type IFormErrorMsgFields = IFormErrorMsgLengthFields | IFormErrorMsgRequiredFields;
