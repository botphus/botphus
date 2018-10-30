import {Col, Icon, Row, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table/interface';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {IModalData, IReduxConnectProps, IReduxStoreState, IUserContentData} from '../../../interfaces/redux';
import {UserPermissionCode} from '../../../types/common';

import {cleanUserList, queryUserListData} from '../../../actions/user';
import {localePkg} from '../../../lib/const';
import {getNumEnumsList, getPageData} from '../../../lib/util';

import UserSearchForm from '../../../components/form/user_search';

interface IUserProps extends IReduxConnectProps {
    modal: IModalData;
    user: IUserContentData;
}

function mapStateToProps({modal, user}: IReduxStoreState) {
    return {
        modal,
        user
    };
}

class DashboardUserPage extends React.Component<IUserProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUserList());
    }
    public componentDidMount() {
        this.handleGetList();
    }
    public render() {
        const {user, modal} = this.props;
        const columns: Array<ColumnProps<any>> = [
            {
                dataIndex: 'email',
                title: localePkg.Model.User.email
            },
            {
                dataIndex: 'nickname',
                title: localePkg.Model.User.nickname
            },
            {
                dataIndex: 'permission',
                title: localePkg.Model.User.permission,
                render(permission) {
                    return getNumEnumsList(UserPermissionCode)
                        .filter((item) => {
                            return item.value > 0 && item.value & permission;
                        })
                        .map((item) => {
                            return localePkg.Enum.UserPermissionCode[item.key];
                        })
                        .join(',');
                }
            },
            {
                fixed: 'right',
                key: 'action',
                title: localePkg.Client.Action.title,
                width: 100,
                render(row) {
                    return <Link to={`/dashboard/user/profile/${row._id}`}>{localePkg.Client.Action.modify}</Link>;
                }
            }
        ];
        return (
            <div className="app-dashboard-user">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.User}</h1>
                        <p className="text-light">{localePkg.Client.Desc.User}</p>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <Link className="ant-btn ant-btn-primary" to="/dashboard/user/profile/create">
                            <Icon type="plus-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.create}
                        </Link>
                    </Col>
                </Row>
                <UserSearchForm onSubmit={this.handleSearch} defaultValue={{}} loading={modal.loadingTable} />
                <Table
                    columns={columns}
                    dataSource={user.content}
                    loading={modal.loadingTable}
                    pagination={getPageData(user)}
                    onChange={this.handlePageClick}
                    bordered={true}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
    private handleGetList = (filters?: any) => {
        const {dispatch} = this.props;
        dispatch(queryUserListData(filters));
    }
    private handlePageClick = (page) => {
        this.handleGetList({
            page: page.current,
            pageSize: page.pageSize
        });
    }
    private handleSearch = (data) => {
        this.handleGetList({
            ...data,
            page: 1
        });
    }
}

export default connect(mapStateToProps)(DashboardUserPage);
