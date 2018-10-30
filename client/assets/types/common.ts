import {IFormErrorMsgLengthFields, IFormErrorMsgRequiredFields} from '../interfaces/common';

export * from '../../../src/server/types/user';
export * from '../../../src/server/types/connection';
export * from '../../../src/server/types/task';
export * from '../../../src/server/types/socket';

export type IFormErrorMsgFields = IFormErrorMsgLengthFields | IFormErrorMsgRequiredFields;
