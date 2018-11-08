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
                                <Route exact path="/dashboard/user/profile/:id" component={asyncLoadComponent('dashboard/user/profile')}/>
                                <Route exact path="/dashboard/connection/" component={asyncLoadComponent('dashboard/connection/index')}/>
                                <Route exact path="/dashboard/connection/profile/:id" component={asyncLoadComponent('dashboard/connection/profile')}/>
                                <Route exact path="/dashboard/task/" component={asyncLoadComponent('dashboard/task/index')}/>
                                <Route exact path="/dashboard/task/profile/:id" component={asyncLoadComponent('dashboard/task/profile')}/>
                                <Route exact path="/dashboard/task-flow/" component={asyncLoadComponent('dashboard/task_flow/index')}/>
                                <Route exact path="/dashboard/task-flow/profile/create" component={asyncLoadComponent('dashboard/task_flow/profile_create')}/>
                                <Route exact path="/dashboard/task-flow/profile/:id" component={asyncLoadComponent('dashboard/task_flow/profile')}/>
                                <Route exact path="/dashboard/union-task/" component={asyncLoadComponent('dashboard/union_task/index')}/>
                                <Route exact path="/dashboard/union-task/profile/:id" component={asyncLoadComponent('dashboard/union_task/profile')}/>
                                <Route exact path="/dashboard/union-task-flow/" component={asyncLoadComponent('dashboard/union_task_flow/index')}/>
                                <Route exact path="/dashboard/union-task-flow/profile/create" component={asyncLoadComponent('dashboard/union_task_flow/profile_create')}/>
                                <Route exact path="/dashboard/union-task-flow/profile/:id" component={asyncLoadComponent('dashboard/union_task_flow/profile')}/>
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
