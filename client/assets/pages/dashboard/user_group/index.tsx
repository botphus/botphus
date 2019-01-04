import {Col, Icon, Row, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table/interface';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {IModalData, IReduxConnectProps, IReduxStoreState, IUserGroupContentData} from '../../../interfaces/redux';

import {cleanUserGroupList, queryUserGroupListData} from '../../../actions/user_group';
import {localePkg} from '../../../lib/const';
import {formatDate} from '../../../lib/format';
import {getPageData} from '../../../lib/util';

import UserGroupSearchForm from '../../../components/form/user_group_search';

interface ITaskProps extends IReduxConnectProps {
    modal: IModalData;
    userGroup: IUserGroupContentData;
}

function mapStateToProps({modal, userGroup}: IReduxStoreState) {
    return {
        modal,
        userGroup
    };
}

class DashboardUserGroupPage extends React.Component<ITaskProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUserGroupList());
    }
    public componentDidMount() {
        this.handleGetList();
    }
    public render() {
        const {userGroup, modal} = this.props;
        const columns: Array<ColumnProps<any>> = [
            {
                dataIndex: 'name',
                title: localePkg.Model.Task.name
            },
            {
                dataIndex: 'createdAt',
                title: localePkg.Model.Common.createdAt,
                render(createAt) {
                    return formatDate(createAt);
                }
            },
            {
                dataIndex: 'updateAt',
                title: localePkg.Model.Common.updateAt,
                render(updateAt) {
                    return formatDate(updateAt);
                }
            },
            {
                fixed: 'right',
                key: 'action',
                title: localePkg.Client.Action.title,
                width: 100,
                render(row) {
                    return <Link to={`/dashboard/user-group/profile/${row._id}`} className="m-r">{localePkg.Client.Action.modify}</Link>;
                }
            }
        ];
        return (
            <div className="app-dashboard-user-group">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.UserGroup}</h1>
                        <p className="text-light">{localePkg.Client.Desc.UserGroup}</p>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <Link className="ant-btn ant-btn-primary" to="/dashboard/user-group/profile/create">
                            <Icon type="plus-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.create}
                        </Link>
                    </Col>
                </Row>
                <UserGroupSearchForm onSubmit={this.handleSearch} defaultValue={{}} loading={modal.loadingTable} />
                <Table
                    columns={columns}
                    dataSource={userGroup.content}
                    loading={modal.loadingTable}
                    pagination={getPageData(userGroup)}
                    onChange={this.handlePageClick}
                    bordered={true}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
    private handleGetList = (filters?: any) => {
        const {dispatch} = this.props;
        dispatch(queryUserGroupListData(filters));
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

export default connect(mapStateToProps)(DashboardUserGroupPage);
