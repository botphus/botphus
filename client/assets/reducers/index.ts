import {combineReducers} from 'redux';

import {IReduxStoreState} from '../interfaces/redux';

import connection from './connection';
import modal from './modal';
import task from './task';
import taskFlow from './task_flow';
import unionTask from './union_task';
import unionTaskFlow from './union_task_flow';
import user from './user';

export default combineReducers<IReduxStoreState>({
    connection,
    modal,
    task,
    taskFlow,
    unionTask,
    unionTaskFlow,
    user
});
