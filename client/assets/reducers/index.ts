import {combineReducers} from 'redux';

import {IReduxStoreState} from '../interfaces/redux';

import modal from './modal';
import user from './user';

export default combineReducers<IReduxStoreState>({
    modal,
    user
});
