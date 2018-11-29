import {Alert, Button, Form, Input, Tabs} from 'antd';
import * as React from 'react';
const {Item} = Form;
const {TabPane} = Tabs;

import {IModifyFormProps} from '../../interfaces/common';
import {ConnectionType} from '../../types/common';
import {RequestAction} from '../../types/request';

import {dateFormat, formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {formatDate} from '../../lib/format';
import {filterEmptyFields} from '../../lib/util';

import SearchSelect from '../form_item/search_select';
import TaskRuleExclude from '../form_item/task_rule_exclude';

interface ITaskFlowProfileCreateFormState {
    tab: 'basic' | 'rule' | 'connection';
}

class TaskFlowProfileCreateForm extends React.Component<IModifyFormProps, ITaskFlowProfileCreateFormState> {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'basic'
        };
    }
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {tab} = this.state;
        const {defaultValue, loading} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue} = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const startPageError = isFieldTouched('startPage') && getFieldError('startPage');
        const taskInfoError = isFieldTouched('taskInfo') && getFieldError('taskInfo');
        const mysqlInfoError = isFieldTouched('mysqlInfo') && getFieldError('mysqlInfo');
        const redisInfoError = isFieldTouched('redisInfo') && getFieldError('redisInfo');
        const excludeOptionError = isFieldTouched('excludeOption') && getFieldError('excludeOption');
        const taskInfo = getFieldValue('taskInfo') || {};
        return (
            <Form onSubmit={this.handleSubmit}>
                <Tabs activeKey={tab} onChange={this.handleChangeTab}>
                    {/* Basic info */}
                    <TabPane tab={localePkg.Client.Title.TaskBasic} key="basic">
                        <Item
                            validateStatus={nameError ? 'error' : 'success'}
                            help={nameError || ''}
                            label={localePkg.Model.TaskFlow.name}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('name', {
                                initialValue: defaultValue.name || `${localePkg.Client.Title.TaskFlow}:${formatDate(new Date(), dateFormat)}`,
                                rules: [{
                                    max: formValidRules.strLength[1],
                                    message: getFormFieldErrorMsg(localePkg.Model.TaskFlow.name, [
                                        {
                                            type: 'required'
                                        },
                                        {
                                            args: formValidRules.strLength,
                                            type: 'length',
                                        }
                                    ]),
                                    min: formValidRules.strLength[0],
                                    required: true
                                }],
                            })(
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.TaskFlow.name)} />
                            )}
                        </Item>
                        <Item
                            validateStatus={startPageError ? 'error' : 'success'}
                            help={startPageError || ''}
                            label={localePkg.Model.TaskFlow.startPage}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('startPage', {
                                initialValue: defaultValue.startPage || '',
                                rules: [{
                                    max: formValidRules.urlLength[1],
                                    message: getFormFieldErrorMsg(localePkg.Model.TaskFlow.startPage, [
                                        {
                                            args: formValidRules.urlLength,
                                            type: 'length',
                                        }
                                    ]),
                                    min: formValidRules.urlLength[0]
                                }],
                            })(
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.TaskFlow.startPage)} />
                            )}
                        </Item>
                        <Item
                            validateStatus={taskInfoError ? 'error' : 'success'}
                            help={taskInfoError || ''}
                            label={localePkg.Model.TaskFlow.taskId}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('taskInfo', {
                                initialValue: defaultValue.taskId ? {
                                    key: defaultValue.taskId, label: defaultValue.taskDetail.name
                                } : undefined,
                                rules: [{
                                    message: getFormFieldErrorMsg(localePkg.Model.TaskFlow.taskId, [
                                        {
                                            type: 'required'
                                        }
                                    ]),
                                    required: true
                                }],
                            })(
                                <SearchSelect
                                    autoLoad={defaultValue.taskId ? false : true}
                                    apiAction={RequestAction.TASK}
                                    listName={localePkg.Model.Task.name}
                                    searchField="name"
                                    listNameKey="name"
                                    listValueKey="_id"
                                />
                            )}
                        </Item>
                        <Item className="text-right" {...tailFormItemLayout}>
                            <Button type="primary" loading={loading} onClick={() => this.handleChangeTab('rule')}>
                                {localePkg.Client.Action.next}
                            </Button>
                        </Item>
                    </TabPane>
                    {/* Rule select*/}
                    <TabPane tab={localePkg.Client.Title.TaskFlowRule} key="rule">
                        {taskInfo.key ? (
                            <Item
                                validateStatus={excludeOptionError ? 'error' : 'success'}
                                help={excludeOptionError || ''}
                                label={localePkg.Model.TaskFlow.excludeOption}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('excludeOption', {
                                    initialValue: defaultValue.excludeOption || {}
                                })(
                                    <TaskRuleExclude taskId={taskInfo.key} />
                                )}
                            </Item>
                        ) : (
                            <Alert message={getFormFieldErrorMsg(localePkg.Model.TaskFlow.taskId, [
                                {
                                    type: 'required'
                                }
                            ])} className="m-b" />
                        )}
                        <Item className="text-right" {...tailFormItemLayout}>
                            <Button loading={loading} onClick={() => this.handleChangeTab('basic')} className="m-r">
                                {localePkg.Client.Action.prev}
                            </Button>
                            <Button type="primary" loading={loading} onClick={() => this.handleChangeTab('connection')}>
                                {localePkg.Client.Action.next}
                            </Button>
                        </Item>
                    </TabPane>
                    {/* Rule info*/}
                    <TabPane tab={localePkg.Client.Title.TaskFlowConnection} key="connection">
                        <Item
                            validateStatus={mysqlInfoError ? 'error' : 'success'}
                            help={mysqlInfoError || localePkg.Client.Help.TaskFlow.connectionId}
                            label={localePkg.Model.TaskFlow.mysqlId}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('mysqlInfo', {
                                initialValue: defaultValue.mysqlId ? {
                                    key: defaultValue.mysqlId, label: defaultValue.mysqlDetail.name
                                } : undefined
                            })(
                                <SearchSelect
                                    autoLoad={true}
                                    apiAction={RequestAction.CONNECTION}
                                    apiData={{
                                        type: ConnectionType.MYSQL
                                    }}
                                    listName={localePkg.Model.Task.name}
                                    searchField="name"
                                    listNameKey="name"
                                    listValueKey="_id"
                                />
                            )}
                        </Item>
                        <Item
                            validateStatus={redisInfoError ? 'error' : 'success'}
                            help={redisInfoError || localePkg.Client.Help.TaskFlow.connectionId}
                            label={localePkg.Model.TaskFlow.redisId}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('redisInfo', {
                                initialValue: defaultValue.redisId ? {
                                    key: defaultValue.redisId, label: defaultValue.redisDetail.name
                                } : undefined
                            })(
                                <SearchSelect
                                    autoLoad={true}
                                    apiAction={RequestAction.CONNECTION}
                                    apiData={{
                                        type: ConnectionType.REDIS
                                    }}
                                    listName={localePkg.Model.Task.name}
                                    searchField="name"
                                    listNameKey="name"
                                    listValueKey="_id"
                                />
                            )}
                        </Item>
                        <Item className="text-right" {...tailFormItemLayout}>
                            <Button loading={loading} onClick={() => this.handleChangeTab('rule')} className="m-r">
                                {localePkg.Client.Action.prev}
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())} loading={loading}>
                                {localePkg.Client.Action.create}
                            </Button>
                        </Item>
                    </TabPane>
                </Tabs>
            </Form>
        );
    }
    private handleSubmit = (e: React.FormEvent<any>) => {
        const {onSubmit} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const result = {...values};
                if (result.taskInfo) {
                    result.taskId = result.taskInfo.key;
                    delete result.taskInfo;
                }
                if (result.mysqlInfo) {
                    result.mysqlId = result.mysqlInfo.key;
                    delete result.mysqlInfo;
                }
                if (result.redisInfo) {
                    result.redisId = result.redisInfo.key;
                    delete result.redisInfo;
                }
                onSubmit(filterEmptyFields(result));
            }
        });
    }
    private handleChangeTab = (tab) => {
        this.setState({
            tab
        });
    }
}

export default Form.create()(TaskFlowProfileCreateForm);
