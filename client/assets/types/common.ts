export {TaskType, TaskTypeDataSubType, TaskTypeDomSubType, TaskTypeEventSubType, TaskTypeTimeSubType, TaskTypePageSubType} from 'botphus-core/dist/source/types/task';

import {IFormErrorMsgLengthFields, IFormErrorMsgRequiredFields} from '../interfaces/common';

export {UserPermissionCode} from '../../../src/server/types/user';
export {ConnectionType} from '../../../src/server/types/connection';
export {TaskSaveRuleTypeItem, TaskPageType} from '../../../src/server/types/task';

export type IFormErrorMsgFields = IFormErrorMsgLengthFields | IFormErrorMsgRequiredFields;
