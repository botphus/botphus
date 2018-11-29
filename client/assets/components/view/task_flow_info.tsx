import {Col, Row} from 'antd';
import * as React from 'react';

import {ITaskFlowDetailItem} from '../../interfaces/task';

import {dateFormat, localePkg} from '../../lib/const';
import {formatDate} from '../../lib/format';

interface ITaskFlowInfoProps {
    detail: ITaskFlowDetailItem;
}

import TaskFlowConnectionInfo from './task_flow_connection';

export default class TaskFlowInfo extends React.Component<ITaskFlowInfoProps> {
    public render() {
        const {detail} = this.props;
        return (
            <div className="app-task-flow-info">
                <Row>
                    <Col span={8}>
                        <span>{localePkg.Model.TaskFlow.name}:{detail.name}</span>
                    </Col>
                    <Col span={8}>
                        <span>{localePkg.Model.Common.createdAt}:{formatDate(detail.createdAt, dateFormat)}</span>
                    </Col>
                    <Col span={8}>
                        <span>{localePkg.Model.TaskFlow.startPage}:{detail.startPage}</span>
                    </Col>
                </Row>
                <TaskFlowConnectionInfo detail={detail} />
            </div>
        );
    }
}
