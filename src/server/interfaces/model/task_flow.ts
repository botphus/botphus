import {ITaskExcludeUnit} from 'botphus-core';
import {Document, Schema} from 'mongoose';

import {TaskPageType} from '../../types/task';

/**
 * Task execution flow model
 */
export interface ITaskFlowModel extends Document {
    startPage?: string;
    // this type will decide the puppeteerLaunchOption & startPageOption
    pageType: TaskPageType;
    // mysql config id
    mysqlId?: Schema.Types.ObjectId;
    // redis config id
    redisId?: Schema.Types.ObjectId;
    excludeOption: ITaskExcludeUnit;
    taskId: Schema.Types.ObjectId;
    createdUser: Schema.Types.ObjectId;
}

export interface ITaskFlowSearchModel extends Document {
    taskId: Schema.Types.ObjectId;
    createdUser?: Schema.Types.ObjectId;
}
