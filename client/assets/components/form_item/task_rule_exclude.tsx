import {message} from 'antd';
import * as React from 'react';

import {IIndexMap} from '../../interfaces/common';
import {ITaskRuleSaveItem} from '../../interfaces/task';
import {RequestAction} from '../../types/request';

import {localePkg} from '../../lib/const';
import request from '../../lib/request';
import {log} from '../../lib/util';

import Loading from '../loading';
import TaskRule from './task_rule';

interface ITaskRuleExcludeProps {
    value?: IIndexMap<true>;
    taskId?: string;
    onChange?: (value: IIndexMap<true>) => void;
}

interface ITaskRuleExcludeState {
    loading: boolean;
    listData: ITaskRuleSaveItem[];
}

export default class TaskRuleExclude extends React.Component<ITaskRuleExcludeProps, ITaskRuleExcludeState> {
    private open: boolean = true;
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            loading: false
        };
    }
    public componentDidMount() {
        const {taskId} = this.props;
        this.handleGetList(taskId);
    }
    public componentDidUpdate(prevProps) {
        const {taskId} = this.props;
        // Check change
        if (taskId === prevProps.taskId) {
            return;
        }
        if (taskId) {
            this.handleGetList(taskId);
        } else {
            this.handleClear();
        }
    }
    public componentWillUnmount() {
        this.open = false;
    }
    public render() {
        const {listData, loading} = this.state;
        const {value} = this.props;
        if (loading) {
            return <Loading />;
        }
        return (
            <TaskRule value={listData} checkValue={listData.filter((item) => {
                return !(value && value[item.id]);
            }).map((item) => {
                return `${item.id}`;
            })} onCheck={this.handleCheck} />
        );
    }
    private handleGetList = (taskId) => {
        if (!taskId) {
            return;
        }
        this.setState({
            loading: true
        });
        request(RequestAction.TASK_PROFILE, {
            id: taskId
        })
            .then((data) => {
                // Check open status
                if (!this.open) {
                    return;
                }
                this.setState({
                    listData: data.data.ruleItems,
                    loading: false
                });
            })
            .catch((err) => {
                // If close, return
                if (!this.open) {
                    return;
                }
                this.setState({
                    loading: false
                });
                log.error(err);
                message.error(`${localePkg.Client.Help.FetchFaild}: ${localePkg.Client.Title.Task}`);
            });
    }
    private handleCheck = (selectKeys: string[]) => {
        const {listData} = this.state;
        const {onChange} = this.props;
        const value: IIndexMap<true> = {};
        listData.forEach((item) => {
            if (selectKeys.indexOf(`${item.id}`) < 0) {
                value[item.id] = true;
            }
        });
        if (onChange) {
            onChange(value);
        }
    }
    private handleClear = () => {
        const {onChange} = this.props;
        if (onChange) {
            onChange({});
        }
        this.setState({
            listData: []
        });
    }
}
