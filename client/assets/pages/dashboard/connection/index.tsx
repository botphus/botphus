import {Col, Icon, Row, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table/interface';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {IConnectionContentData, IModalData, IReduxConnectProps, IReduxStoreState} from '../../../interfaces/redux';
import {ConnectionType} from '../../../types/common';

import {cleanConnectionList, queryConnectionListData} from '../../../actions/connection';
import {localePkg} from '../../../lib/const';
import {getPageData} from '../../../lib/util';

import ConnectionSearchForm from '../../../components/form/connection_search';

interface IConnectionProps extends IReduxConnectProps {
    modal: IModalData;
    connection: IConnectionContentData;
}

function mapStateToProps({modal, connection}: IReduxStoreState) {
    return {
        connection,
        modal
    };
}

class DashboardConnectionPage extends React.Component<IConnectionProps> {
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanConnectionList());
    }
    public componentDidMount() {
        this.handleGetList();
    }
    public render() {
        const {connection, modal} = this.props;
        const columns: Array<ColumnProps<any>> = [
            {
                dataIndex: 'name',
                title: localePkg.Model.Connection.name
            },
            {
                dataIndex: 'type',
                title: localePkg.Model.Connection.type,
                render(type) {
                    return localePkg.Enum.ConnectionType[ConnectionType[type]];
                }
            },
            {
                fixed: 'right',
                key: 'action',
                title: localePkg.Client.Action.title,
                width: 100,
                render(row) {
                    return <Link to={`/dashboard/connection/profile/${row._id}`}>{localePkg.Client.Action.modify}</Link>;
                }
            }
        ];
        return (
            <div className="app-dashboard-connection">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.Connection}</h1>
                        <p className="text-light">{localePkg.Client.Desc.Connection}</p>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <Link className="ant-btn ant-btn-primary" to="/dashboard/connection/profile/create">
                            <Icon type="plus-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.create}
                        </Link>
                    </Col>
                </Row>
                <ConnectionSearchForm onSubmit={this.handleSearch} defaultValue={{}} loading={modal.loadingTable} />
                <Table
                    columns={columns}
                    dataSource={connection.content}
                    loading={modal.loadingTable}
                    pagination={getPageData(connection)}
                    onChange={this.handlePageClick}
                    bordered={true}
                    scroll={{ x: 1000 }}
                />
            </div>
        );
    }
    private handleGetList = (filters?: any) => {
        const {dispatch} = this.props;
        dispatch(queryConnectionListData(filters));
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

export default connect(mapStateToProps)(DashboardConnectionPage);
