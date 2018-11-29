import {message} from 'antd';
import * as React from 'react';

import {IIndexMap} from '../../interfaces/common';
import {IUnionTaskSaveItem} from '../../interfaces/task';
import {RequestAction} from '../../types/request';

import {localePkg} from '../../lib/const';
import request from '../../lib/request';
import {log} from '../../lib/util';

import Loading from '../loading';
import UnionTaskRule from './union_task_rule';

interface IUnionTaskRuleExcludeProps {
    value?: IIndexMap<true>;
    unionTaskId?: string;
    onChange?: (value: IIndexMap<true>) => void;
}

interface IUnionTaskRuleExcludeState {
    loading: boolean;
    listData: IUnionTaskSaveItem[];
}

export default class UnionTaskRuleExclude extends React.Component<IUnionTaskRuleExcludeProps, IUnionTaskRuleExcludeState> {
    private open: boolean = true;
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            loading: false
        };
    }
    public componentDidMount() {
        const {unionTaskId} = this.props;
        this.handleGetList(unionTaskId);
    }
    public componentDidUpdate(prevProps) {
        const {unionTaskId} = this.props;
        // Check change
        if (unionTaskId === prevProps.unionTaskId) {
            return;
        }
        if (unionTaskId) {
            this.handleGetList(unionTaskId);
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
            <UnionTaskRule value={listData} checkValue={listData.filter((item) => {
                return !(value && value[item.taskId]);
            }).map((item) => {
                return item.taskId;
            })} onCheck={this.handleCheck} />
        );
    }
    private handleGetList = (unionTaskId) => {
        if (!unionTaskId) {
            return;
        }
        this.setState({
            loading: true
        });
        request(RequestAction.UNION_TASK_PROFILE, {
            id: unionTaskId
        })
            .then((data) => {
                // Check open status
                if (!this.open) {
                    return;
                }
                this.setState({
                    listData: data.data.taskItems,
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
            if (selectKeys.indexOf(item.taskId) < 0) {
                value[item.taskId] = true;
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
