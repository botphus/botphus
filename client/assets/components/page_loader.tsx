import * as React from 'react';
import * as Loadable from 'react-loadable';

import Loading from './loading';

/**
 * Load component page
 * @param  {[type]} pagePath: string        [description]
 * @return {[type]}           [description]
 */
export default function asyncLoadComponent(pagePath: string):
(React.ComponentClass<any> & Loadable.LoadableComponent) | (React.StatelessComponent<any> & Loadable.LoadableComponent) {
    return Loadable({
        // Complie to es6, so ignore this error
        // @ts-ignore:next
        loader: () => import(`../pages/${pagePath}`),
        loading: () => <Loading />
    });
}
