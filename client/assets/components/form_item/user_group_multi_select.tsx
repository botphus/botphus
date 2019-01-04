import {message, Select, Spin} from 'antd';
import {LabeledValue} from 'antd/lib/select';
import * as React from 'react';
const {Option} = Select;

import {IFormSelectOptionItem} from '../../interfaces/common';
import {RequestAction} from '../../types/request';

import {formValidRules, localePkg} from '../../lib/const';
import {getFormFieldPlaceholder} from '../../lib/form';
import request from '../../lib/request';
import {log} from '../../lib/util';

interface IUserGroupMultiSelectProps {
    delayTime?: number; // Request delay time
    value?: LabeledValue[];
    onChange?: (value: LabeledValue[]) => void;
}

interface IUserGroupMultiSelectState {
    loading: boolean;
    listData: IFormSelectOptionItem[];
}

export default class UserGroupMultiSelect extends React.Component<IUserGroupMultiSelectProps, IUserGroupMultiSelectState> {
    private open: boolean = true;
    private timer: any = null;
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            loading: false
        };
    }
    public componentWillUnmount() {
        this.open = false;
        this.clearTimer();
    }
    public render() {
        const {listData, loading} = this.state;
        const {value, onChange} = this.props;
        return (
            <Select
                mode="multiple"
                value={value}
                onSearch={this.handleSearch}
                onChange={onChange}
                placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Search, localePkg.Model.UserGroup.name)}
                labelInValue
                notFoundContent={loading ? <Spin size="small" /> : getFormFieldPlaceholder(localePkg.Placehoder.NotFound, localePkg.Model.UserGroup.name)}
                filterOption={false}
            >
                {listData.map((item, index) => {
                    return <Option key={index.toString()} value={item.key} title={item.label}>{item.label}</Option>;
                })}
            </Select>
        );
    }
    private handleGetList = (name) => {
        this.setState({
            loading: true
        });
        request(RequestAction.USER_GROUP, {
            name
        })
            .then((data) => {
                // Check open status
                if (!this.open) {
                    return;
                }
                const listData: IFormSelectOptionItem[] = data.data.content.map((item) => {
                    return {
                        key: item._id,
                        label: item.name
                    };
                });
                this.setState({
                    listData,
                    loading: false
                });
            })
            .catch((err) => {
                // 判断如果卸载,则不再设置数据
                if (!this.open) {
                    return;
                }
                this.setState({
                    loading: false
                });
                log.error(err);
                message.error(`${localePkg.Client.Help.FetchFaild}: ${localePkg.Model.UserGroup.name}`);
            });
    }
    private handleSearch = (value) => {
        const {delayTime} = this.props;
        this.clearTimer();
        if (value && value.length >= formValidRules.strLength[0]) {
            this.timer = setTimeout(() => this.handleGetList(value), delayTime || 300);
        }
    }
    private clearTimer = () => {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
