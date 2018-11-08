import {Col, Row} from 'antd';
import * as React from 'react';

import {IUnionTaskFlowDetailItem} from '../../interfaces/task';

import {dateFormat, localePkg} from '../../lib/const';
import {formatDate} from '../../lib/format';

interface IUnionTaskFlowInfoProps {
    detail: IUnionTaskFlowDetailItem;
}

import TaskFlowConnectionInfo from './task_flow_connection';

export default class UnionTaskFlowInfo extends React.Component<IUnionTaskFlowInfoProps> {
    public render() {
        const {detail} = this.props;
        return (
            <div className="app-task-flow-info">
                <Row>
                    <Col span={8}>
                        <span>{localePkg.Model.UnionTaskFlow.name}:{detail.name}</span>
                    </Col>
                    <Col span={8}>
                        <span>{localePkg.Model.Common.createdAt}:{formatDate(detail.createdAt, dateFormat)}</span>
                    </Col>
                    <Col span={8}>
                        <span>{localePkg.Model.UnionTaskFlow.suffixDomain}:{detail.suffixDomain}</span>
                    </Col>
                </Row>
                <TaskFlowConnectionInfo detail={detail} />
            </div>
        );
    }
}
