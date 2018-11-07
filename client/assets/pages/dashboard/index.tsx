import {Timeline} from 'antd';
import * as React from 'react';
const {Item} = Timeline;

import {localePkg} from '../../lib/const';

class NotFoundPage extends React.Component {
    public render() {
        return (
            <div className="app-dashboard">
                <h1>{localePkg.Client.Desc.Home}</h1>
                <Timeline>
                    <Item>
                        <p>{localePkg.Client.Title.Connection}</p>
                        <p className="text-light">{localePkg.Client.Desc.Connection}</p>
                    </Item>
                    <Item>
                        <p>{localePkg.Client.Title.Task}</p>
                        <p className="text-light">{localePkg.Client.Desc.Task}</p>
                    </Item>
                    <Item>
                        <p>{localePkg.Client.Title.TaskFlow}</p>
                        <p className="text-light">{localePkg.Client.Desc.TaskFlow}</p>
                    </Item>
                    <Item>
                        <p>{localePkg.Client.Title.TaskReport}</p>
                        <p className="text-light">{localePkg.Client.Desc.TaskReport}</p>
                    </Item>
                    <Item>
                        <p>{localePkg.Client.Title.UnionTask}</p>
                        <p className="text-light">{localePkg.Client.Desc.UnionTask}</p>
                    </Item>
                    <Item>
                        <p>{localePkg.Client.Title.UnionTaskFlow}</p>
                        <p className="text-light">{localePkg.Client.Desc.UnionTaskFlow}</p>
                    </Item>
                </Timeline>
            </div>
        );
    }
}

export default NotFoundPage;
