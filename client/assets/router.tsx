import { Layout, LocaleProvider } from 'antd';
import {createBrowserHistory} from 'history';
import * as React from 'react';
import {Provider} from 'react-redux';
import { Route, Router, Switch } from 'react-router';

// Set language package: pack in "webpack.config.js" alias
// @ts-ignore: next
import localeAntd from 'localeAntd';

// import base style
import './style/app.less';

import store from './store';

export const routerHistory = createBrowserHistory();

import NotFound from './pages/not_found';

import asyncLoadComponent from './components/page_loader';

export default (
    <LocaleProvider locale={localeAntd}>
        <Provider store={store}>
            <Router history={routerHistory}>
                <Layout className="app-layout">
                    <Switch>
                        <Route path="/install/" component={asyncLoadComponent('install')} />
                        <Route component={NotFound} />
                    </Switch>
                </Layout>
            </Router>
        </Provider>
    </LocaleProvider>
);
