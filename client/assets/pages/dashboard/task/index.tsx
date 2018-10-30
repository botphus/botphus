import {Col, Icon, Row, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table/interface';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {IModalData, IReduxConnectProps, IReduxStoreState, ITaskContentData} from '../../../interfaces/redux';
import {TaskPageType} from '../../../types/common';

import {cleanTaskList, queryTaskListData} from '../../../actions/task';
import {localePkg} from '../../../lib/const';
import {formatDate} from '../../../lib/format';
import {getPageData} from '../../../lib/util';

import TaskSearchForm from '../../../components/form/task_search';

interface ITaskProps extends IReduxConnectProps {
    modal: IModalData;
    task: ITaskContentData;
}

function mapStateToProps({modal, task}: IReduxStoreState) {
    return {
        modal,
        task
    };
}

class DashboardTaskPage extends React.Component<ITaskProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanTaskList());
    }
    public componentDidMount() {
        this.handleGetList();
    }
    public render() {
        const {task, modal} = this.props;
        const columns: Array<ColumnProps<any>> = [
            {
                dataIndex: 'name',
                title: localePkg.Model.Task.name
            },
            {
                dataIndex: 'pageType',
                title: localePkg.Model.Task.pageType,
                render(pageType) {
                    return localePkg.Enum.TaskPageType[TaskPageType[pageType]];
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
                    return <Link to={`/dashboard/task/profile/${row._id}`}>{localePkg.Client.Action.modify}</Link>;
                }
            }
        ];
        return (
            <div className="app-dashboard-task">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.Task}</h1>
                        <p className="text-light">{localePkg.Client.Desc.Task}</p>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <Link className="ant-btn ant-btn-primary" to="/dashboard/task/profile/create">
                            <Icon type="plus-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.create}
                        </Link>
                    </Col>
                </Row>
                <TaskSearchForm onSubmit={this.handleSearch} defaultValue={{}} loading={modal.loadingTable} />
                <Table
                    columns={columns}
                    dataSource={task.content}
                    loading={modal.loadingTable}
                    pagination={getPageData(task)}
                    onChange={this.handlePageClick}
                    bordered={true}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
    private handleGetList = (filters?: any) => {
        const {dispatch} = this.props;
        dispatch(queryTaskListData(filters));
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

export default connect(mapStateToProps)(DashboardTaskPage);
