import {Col, Icon, Row, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table/interface';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {IModalData, IReduxConnectProps, IReduxStoreState, IUnionTaskFlowContentData} from '../../../interfaces/redux';
import {TaskFlowStatus} from '../../../types/common';

import {cleanUnionTaskFlowList, queryUnionTaskFlowListData} from '../../../actions/union_task_flow';
import {localePkg} from '../../../lib/const';
import {formatDate} from '../../../lib/format';
import {getPageData} from '../../../lib/util';

import UnionTaskFlowSearchForm from '../../../components/form/union_task_flow_search';

interface IUnionTaskFlowProps extends IReduxConnectProps {
    modal: IModalData;
    unionTaskFlow: IUnionTaskFlowContentData;
}

function mapStateToProps({modal, unionTaskFlow}: IReduxStoreState) {
    return {
        modal,
        unionTaskFlow
    };
}

class DashboardUnionTaskFlowPage extends React.Component<IUnionTaskFlowProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUnionTaskFlowList());
    }
    public componentDidMount() {
        this.handleGetList();
    }
    public render() {
        const {unionTaskFlow, modal} = this.props;
        const columns: Array<ColumnProps<any>> = [
            {
                dataIndex: 'name',
                title: localePkg.Model.UnionTaskFlow.name
            },
            {
                dataIndex: 'status',
                title: localePkg.Model.UnionTaskFlow.status,
                render(status) {
                    return localePkg.Enum.TaskFlowStatus[TaskFlowStatus[status]] || '-';
                }
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
                    return (
                        <span>
                            <Link to={`/dashboard/union-task-flow/profile/${row._id}`}>{localePkg.Client.Action.detail}</Link>
                            <Link to={`/dashboard/union-task-flow/profile/create?copyId=${row._id}`} className="m-l-sm">{localePkg.Client.Action.copy}</Link>
                        </span>
                    );
                }
            }
        ];
        return (
            <div className="app-dashboard-union-task-flow">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.UnionTaskFlow}</h1>
                        <p className="text-light">{localePkg.Client.Desc.UnionTaskFlow}</p>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <Link className="ant-btn ant-btn-primary" to="/dashboard/union-task-flow/profile/create">
                            <Icon type="plus-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.create}
                        </Link>
                    </Col>
                </Row>
                <UnionTaskFlowSearchForm onSubmit={this.handleSearch} defaultValue={{}} loading={modal.loadingTable} />
                <Table
                    columns={columns}
                    dataSource={unionTaskFlow.content}
                    loading={modal.loadingTable}
                    pagination={getPageData(unionTaskFlow)}
                    onChange={this.handlePageClick}
                    bordered={true}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
    private handleGetList = (filters?: any) => {
        const {dispatch} = this.props;
        dispatch(queryUnionTaskFlowListData(filters));
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

export default connect(mapStateToProps)(DashboardUnionTaskFlowPage);
