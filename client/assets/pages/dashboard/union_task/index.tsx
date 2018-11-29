import {Col, Icon, Row, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table/interface';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {IModalData, IReduxConnectProps, IReduxStoreState, IUnionTaskContentData} from '../../../interfaces/redux';

import {cleanUnionTaskList, queryUnionTaskListData} from '../../../actions/union_task';
import {localePkg} from '../../../lib/const';
import {formatDate} from '../../../lib/format';
import {getPageData} from '../../../lib/util';

import UnionTaskSearchForm from '../../../components/form/union_task_search';

interface ITaskProps extends IReduxConnectProps {
    modal: IModalData;
    unionTask: IUnionTaskContentData;
}

function mapStateToProps({modal, unionTask}: IReduxStoreState) {
    return {
        modal,
        unionTask
    };
}

class DashboardUnionTaskPage extends React.Component<ITaskProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUnionTaskList());
    }
    public componentDidMount() {
        this.handleGetList();
    }
    public render() {
        const {unionTask, modal} = this.props;
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
                    return <Link to={`/dashboard/union-task/profile/${row._id}`}>{localePkg.Client.Action.modify}</Link>;
                }
            }
        ];
        return (
            <div className="app-dashboard-union-task">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.UnionTask}</h1>
                        <p className="text-light">{localePkg.Client.Desc.UnionTask}</p>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <Link className="ant-btn ant-btn-primary" to="/dashboard/union-task/profile/create">
                            <Icon type="plus-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.create}
                        </Link>
                    </Col>
                </Row>
                <UnionTaskSearchForm onSubmit={this.handleSearch} defaultValue={{}} loading={modal.loadingTable} />
                <Table
                    columns={columns}
                    dataSource={unionTask.content}
                    loading={modal.loadingTable}
                    pagination={getPageData(unionTask)}
                    onChange={this.handlePageClick}
                    bordered={true}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
    private handleGetList = (filters?: any) => {
        const {dispatch} = this.props;
        dispatch(queryUnionTaskListData(filters));
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

export default connect(mapStateToProps)(DashboardUnionTaskPage);
