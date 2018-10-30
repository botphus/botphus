import {Col, Icon, Row, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table/interface';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {IModalData, IReduxConnectProps, IReduxStoreState, ITaskFlowContentData} from '../../../interfaces/redux';

import {cleanTaskFlowList, queryTaskFlowListData} from '../../../actions/task_flow';
import {localePkg} from '../../../lib/const';
import {formatDate} from '../../../lib/format';
import {getPageData} from '../../../lib/util';

import TaskFlowSearchForm from '../../../components/form/task_flow_search';

interface ITaskFlowProps extends IReduxConnectProps {
    modal: IModalData;
    taskFlow: ITaskFlowContentData;
}

function mapStateToProps({modal, taskFlow}: IReduxStoreState) {
    return {
        modal,
        taskFlow
    };
}

class DashboardTaskFlowPage extends React.Component<ITaskFlowProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanTaskFlowList());
    }
    public componentDidMount() {
        this.handleGetList();
    }
    public render() {
        const {taskFlow, modal} = this.props;
        const columns: Array<ColumnProps<any>> = [
            {
                dataIndex: 'name',
                title: localePkg.Model.TaskFlow.name
            },
            {
                dataIndex: 'createdAt',
                title: localePkg.Model.Common.createdAt,
                render(createAt) {
                    return formatDate(createAt);
                }
            },
            {
                fixed: 'right',
                key: 'action',
                title: localePkg.Client.Action.title,
                width: 100,
                render(row) {
                    return <Link to={`/dashboard/task-flow/profile/${row._id}`}>{localePkg.Client.Action.detail}</Link>;
                }
            }
        ];
        return (
            <div className="app-dashboard-task-flow">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.TaskFlow}</h1>
                        <p className="text-light">{localePkg.Client.Desc.TaskFlow}</p>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <Link className="ant-btn ant-btn-primary" to="/dashboard/task-flow/profile/create">
                            <Icon type="plus-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.create}
                        </Link>
                    </Col>
                </Row>
                <TaskFlowSearchForm onSubmit={this.handleSearch} defaultValue={{}} loading={modal.loadingTable} />
                <Table
                    columns={columns}
                    dataSource={taskFlow.content}
                    loading={modal.loadingTable}
                    pagination={getPageData(taskFlow)}
                    onChange={this.handlePageClick}
                    bordered={true}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
    private handleGetList = (filters?: any) => {
        const {dispatch} = this.props;
        dispatch(queryTaskFlowListData(filters));
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

export default connect(mapStateToProps)(DashboardTaskFlowPage);
