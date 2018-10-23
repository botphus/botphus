import {LocaleProvider} from 'antd';
import {createBrowserHistory} from 'history';
import * as React from 'react';
import {Provider} from 'react-redux';
import {Route, Router, Switch} from 'react-router';

// Set language package: pack in "webpack.config.js" alias
// @ts-ignore: next
import localeAntd from 'localeAntd';

// import base style
import './style/app.less';

import store from './store';

export const routerHistory = createBrowserHistory();

import LayoutPage from './pages/layout';
import LayoutDashboardPage from './pages/layout_dashboard';
import NotFoundPage from './pages/not_found';

import asyncLoadComponent from './components/page_loader';

export default (
    <LocaleProvider locale={localeAntd}>
        <Provider store={store}>
            <LayoutPage>
                <Router history={routerHistory}>
                    <Switch>
                        <Route path="/install/" component={asyncLoadComponent('install')} />
                        <Route path="/login/" component={asyncLoadComponent('login')} />
                        <LayoutDashboardPage>
                            <Switch>
                                <Route exact path="/dashboard/" component={asyncLoadComponent('dashboard/index')}/>
                                <Route exact path="/dashboard/profile/" component={asyncLoadComponent('dashboard/profile')}/>
                                <Route exact path="/dashboard/user/" component={asyncLoadComponent('dashboard/user/index')}/>
                                <Route component={NotFoundPage} />
                            </Switch>
                        </LayoutDashboardPage>
                        <Route component={NotFoundPage} />
                    </Switch>
                </Router>
            </LayoutPage>
        </Provider>
    </LocaleProvider>
);
