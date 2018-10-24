import {combineReducers} from 'redux';

import {IReduxStoreState} from '../interfaces/redux';

import connection from './connection';
import modal from './modal';
import user from './user';

export default combineReducers<IReduxStoreState>({
    connection,
    modal,
    user
});
