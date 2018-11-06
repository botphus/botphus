import {message, Select, Spin} from 'antd';
import {LabeledValue} from 'antd/lib/select';
import * as React from 'react';
const {Option} = Select;

import {IFormSelectOptionItem, IIndexMap} from '../../interfaces/common';
import {RequestAction, RequestMethodType} from '../../types/request';

import {formValidRules, localePkg} from '../../lib/const';
import {getFormFieldPlaceholder} from '../../lib/form';
import request from '../../lib/request';
import {log} from '../../lib/util';

interface ISearchSelectProps {
    autoLoad?: boolean; // Auto load when mount
    apiAction: RequestAction;
    apiData?: any;
    apiMethod?: RequestMethodType;
    listName: string; // The list's name
    listValueKey: string; // The key of listData that give to the list's option value
    listNameKey: string; // The key of listData that give to the list's option name
    searchField: string; // The search query field name
    delayTime?: number; // Request delay time
    value?: LabeledValue;
    onChange?: (value: LabeledValue) => void;
}

interface ISearchSelectState {
    loading: boolean;
    listData: IFormSelectOptionItem[];
}

export default class SearchSelect extends React.Component<ISearchSelectProps, ISearchSelectState> {
    private open: boolean = true;
    private timer: any = null;
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            loading: false
        };
    }
    public componentDidMount() {
        const {autoLoad} = this.props;
        if (autoLoad) {
            this.handleGetList('');
        }
    }
    public componentWillUnmount() {
        this.open = false;
        this.clearTimer();
    }
    public render() {
        const {listData, loading} = this.state;
        const {value, onChange, listName, listValueKey, listNameKey} = this.props;
        return (
            <Select
                showSearch
                allowClear
                value={value}
                onSearch={this.handleSearch}
                onChange={onChange}
                placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Search, listName)}
                labelInValue
                notFoundContent={loading ? <Spin size="small" /> : getFormFieldPlaceholder(localePkg.Placehoder.NotFound, listName)}
                filterOption={false}
            >
                {listData.length === 0 && value && value.key ? (
                    <Option value={value.key}>{value.label}</Option>
                ) : null}
                {listData.map((item, index) => {
                    return <Option key={index.toString()} value={item[listValueKey]} title={item[listNameKey]}>{item[listNameKey]}</Option>;
                })}
            </Select>
        );
    }
    private handleGetList = (value) => {
        const {searchField, apiAction, apiMethod, apiData, listName} = this.props;
        this.setState({
            loading: true
        });
        const sendData: IIndexMap<string> = {
            ...apiData
        };
        sendData[searchField] = value;
        request(apiAction, sendData, apiMethod)
            .then((data) => {
                // Check open status
                if (!this.open) {
                    return;
                }
                this.setState({
                    listData: data.data.content,
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
                message.error(`${localePkg.Client.Help.FetchFaild}: ${listName}`);
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
