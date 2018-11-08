import {Icon, Layout, Menu} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';
const {Sider, Content} = Layout;

import {IReduxConnectProps, IReduxStoreState, IUserContentData} from '../interfaces/redux';
import {UserPermissionCode} from '../types/common';

import {cleanUserOwner, postLogoutData} from '../actions/user';
import {localePkg} from '../lib/const';
import {checkUserPermission} from '../lib/util';
import {routerHistory} from '../router';

interface ILayoutDashboardPage extends IReduxConnectProps {
    user: IUserContentData;
    children?: React.ReactChild;
}

function mapStateToProps({user}: IReduxStoreState) {
    return {
        user
    };
}

class LayoutDashboardPage extends React.Component<ILayoutDashboardPage & RouteComponentProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUserOwner());
    }
    public render() {
        const {user, children, location} = this.props;
        const curKey = location.pathname.match(/^\/dashboard\/([^\/]+)\//);
        return (
            <Layout className="app-dashboard">
                <Sider className="app-menu" collapsible breakpoint="lg">
                    <div className="logo">
                        <Link to="/dashboard/"><span className="text">{localePkg.Client.Title.Home}</span></Link>
                    </div>
                    <div className="user-profile">
                        <a onClick={this.handleLogout} className="logout"><Icon type="logout" theme="outlined" title={localePkg.Client.Action.logout} /></a>
                        <div className="nickname">
                            {user.owner.nickname}
                        </div>
                    </div>
                    <Menu theme="dark" onClick={this.handleClickMenu} selectedKeys={curKey ? [curKey[1]] : []}>
                        <Menu.Item key="profile">
                            <Icon type="user" theme="outlined" />
                            <span className="title">{localePkg.Client.Title.Profile}</span>
                        </Menu.Item>
                        {checkUserPermission(user.owner.permission, UserPermissionCode.SYSTEM) ? (
                            <Menu.Item key="user">
                                <Icon type="usergroup-add" theme="outlined" />
                                <span className="title">{localePkg.Client.Title.User}</span>
                            </Menu.Item>
                        ) : null}
                        {checkUserPermission(user.owner.permission, UserPermissionCode.SYSTEM) ? (
                            <Menu.Item key="connection">
                                <Icon type="link" theme="outlined" />
                                <span className="title">{localePkg.Client.Title.Connection}</span>
                            </Menu.Item>
                        ) : null}
                        {checkUserPermission(user.owner.permission, UserPermissionCode.TASK_MANAGE) ? (
                            <Menu.Item key="task">
                                <Icon type="hdd" theme="outlined" />
                                <span className="title">{localePkg.Client.Title.Task}</span>
                            </Menu.Item>
                        ) : null}
                        {checkUserPermission(user.owner.permission, UserPermissionCode.TASK_FLOW) ? (
                            <Menu.Item key="task-flow">
                                <Icon type="code" theme="outlined" />
                                <span className="title">{localePkg.Client.Title.TaskFlow}</span>
                            </Menu.Item>
                        ) : null}
                        {checkUserPermission(user.owner.permission, UserPermissionCode.TASK_MANAGE) ? (
                            <Menu.Item key="union-task">
                                <Icon type="ordered-list" theme="outlined" />
                                <span className="title">{localePkg.Client.Title.UnionTask}</span>
                            </Menu.Item>
                        ) : null}
                        {checkUserPermission(user.owner.permission, UserPermissionCode.TASK_FLOW) ? (
                            <Menu.Item key="union-task-flow">
                                <Icon type="file-done" theme="outlined" />
                                <span className="title">{localePkg.Client.Title.UnionTaskFlow}</span>
                            </Menu.Item>
                        ) : null}
                    </Menu>
                </Sider>
                <Content>
                    {children}
                </Content>
            </Layout>
        );
    }
    private handleClickMenu = (e) => {
        routerHistory.push(`/dashboard/${e.key}/`);
    }
    private handleLogout = (e) => {
        const {dispatch} = this.props;
        e.preventDefault();
        dispatch(postLogoutData(() => {
            routerHistory.push('/login/');
        }));
    }
}

export default withRouter(connect(mapStateToProps)(LayoutDashboardPage));
