import {Button, Icon, Tooltip} from 'antd';
import * as React from 'react';

import {TaskFlowStatus} from '../../types/common';

import {localePkg} from '../../lib/const';

interface ITaskFlowBtnProps {
    status?: TaskFlowStatus;
    onStart: () => void;
}

export default class TaskFlowBtn extends React.Component<ITaskFlowBtnProps> {
    public render() {
        const {status, onStart} = this.props;
        if (typeof status !== 'number') {
            return null;
        }
        switch (status) {
            case TaskFlowStatus.CLOSE:
                return (
                    <Tooltip placement="topLeft" title={localePkg.Service.TaskFlow.startForbidden}>
                        <Button type="primary" className="m-r" disabled>
                            <Icon type="close-circle" className="m-r-sm" theme="outlined" />
                            {localePkg.Client.Action.startTaskFlow}
                        </Button>
                    </Tooltip>
                );
            case TaskFlowStatus.SUCCESS:
                return (
                    <Button type="primary" className="m-r" onClick={onStart}>
                        <Icon type="check-circle" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.startTaskFlow}
                    </Button>
                );
            case TaskFlowStatus.FAILED:
                return (
                    <Button type="danger" className="m-r" onClick={onStart}>
                        <Icon type="close-circle" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.restartTaskFlow}
                    </Button>
                );
            case TaskFlowStatus.ONGOING:
                return (
                    <Button type="primary" className="m-r" disabled>
                        <Icon type="loading" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.startTaskFlow}
                    </Button>
                );
            default:
                return (
                    <Button type="primary" className="m-r" onClick={onStart}>
                        <Icon type="pause-circle" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.startTaskFlow}
                    </Button>
                );
        }
    }
}
