import {ITaskExcludeUnit} from 'botphus-core';
import {Document, Schema, Types} from 'mongoose';

import {TaskFlowPageType} from '../../types/task';

/**
 * Task execution flow model
 */
export interface ITaskFlowModel extends Document {
    name: string;
    startPage?: string;
    // this type will decide the puppeteerLaunchOption & startPageOption
    pageType: TaskFlowPageType;
    // mysql config id
    mysqlId?: Schema.Types.ObjectId;
    // redis config id
    redisId?: Schema.Types.ObjectId;
    excludeOption: ITaskExcludeUnit;
    taskId: Schema.Types.ObjectId;
    createdUser: Types.ObjectId;
}

export interface ITaskFlowSearchModel extends Document {
    name: string;
    pageType: TaskFlowPageType;
    createdUser?: Types.ObjectId;
}
