import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import {IReduxStoreState} from './interfaces/redux';

import reducer from './reducers/';

const createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore);

// Install redux chrome plugin
function configureStore(initialState) {
    // @ts-ignore:next
    const debugMiddlewareStore = createStoreWithMiddleware(reducer, initialState, window.devToolsExtension ? window.devToolsExtension() : undefined);
    return debugMiddlewareStore;
}

let store: Store<IReduxStoreState>;
// @ts-ignore:next
if (process.env.NODE_ENV === 'production') {
    store = createStoreWithMiddleware(reducer, {});
} else {
    // Store
    store = configureStore({});
}

export default store;
