import {Steps} from 'antd';
import * as React from 'react';
const {Step} = Steps;

import {localePkg} from '../../lib/const';

class NotFoundPage extends React.Component {
    public render() {
        return (
            <div>
                <h1>{localePkg.Client.Desc.Home}</h1>
                <Steps progressDot>
                    <Step title={localePkg.Client.Title.Connection} description={localePkg.Client.Desc.Connection} status="finish" />
                    <Step title={localePkg.Client.Title.Task} description={localePkg.Client.Desc.Task} status="finish" />
                    <Step title={localePkg.Client.Title.TaskFlow} description={localePkg.Client.Desc.TaskFlow} status="finish" />
                    <Step title={localePkg.Client.Title.TaskReport} description={localePkg.Client.Desc.TaskReport} status="finish" />
                </Steps>
            </div>
        );
    }
}

export default NotFoundPage;
