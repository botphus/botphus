import {Col, Divider, Row} from 'antd';
import * as React from 'react';

import {ITaskReportDetailItem} from '../../interfaces/task';
import {TaskReportStatus} from '../../types/common';

import {localePkg} from '../../lib/const';
import {getFormFieldPlaceholder} from '../../lib/form';

interface ITaskReportProps {
    report: ITaskReportDetailItem;
}

export default class TaskReport extends React.Component<ITaskReportProps> {
    public render() {
        const {report} = this.props;
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <span className="m-r">{localePkg.Model.Common._id}: </span>
                        {report._id}
                    </Col>
                    <Col span={24}>
                        <span className="m-r">{localePkg.Model.TaskReport.index}: </span>
                        {report.index}
                    </Col>
                    <Col span={24}>
                        <span className="m-r">{localePkg.Model.TaskReport.status}: </span>
                        {typeof report.status === 'number' ? localePkg.Enum.TaskReportStatus[TaskReportStatus[report.status]] : ''}
                    </Col>
                </Row>
                <Divider>{localePkg.Model.TaskReport.receiveData}</Divider>
                <div>{report.receiveData || getFormFieldPlaceholder(localePkg.Placehoder.Empty, localePkg.Model.TaskReport.receiveData)}</div>
                <Divider>{localePkg.Model.TaskReport.message}</Divider>
                <div>{report.message || getFormFieldPlaceholder(localePkg.Placehoder.Empty, localePkg.Model.TaskReport.message)}</div>
            </div>
        );
    }
}
