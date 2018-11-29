import {Alert, Button, Card, Drawer, Form, Input, Tabs} from 'antd';
import * as React from 'react';
const {Item} = Form;
const {TabPane} = Tabs;

import {IModifyFormProps} from '../../interfaces/common';
import {IUnionTaskSaveItem} from '../../interfaces/task';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields, sortItems} from '../../lib/util';

import MemberMultiSelect from '../form_item/member_multi_select';
import UnionTaskRule from '../form_item/union_task_rule';
import Loading from '../loading';
import UnionTaskItemModifyForm from './union_task_item_modify';

interface IUnionTaskProfileModifyFormState {
    tab: 'basic' | 'rule';
    taskId: string;
    taskItem?: IUnionTaskSaveItem;
}

class UnionTaskProfileModifyForm extends React.Component<IModifyFormProps, IUnionTaskProfileModifyFormState> {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'basic',
            taskId: ''
        };
    }
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {tab, taskId, taskItem} = this.state;
        const {defaultValue, loading, isCreate} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue} = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const membersError = isFieldTouched('members') && getFieldError('members');
        getFieldDecorator('taskItems', {
            initialValue: defaultValue.taskItems || [],
            rules: [{
                required: true,
                type: 'array',
            }]
        });
        const taskItems: IUnionTaskSaveItem[] = getFieldValue('taskItems');
        return (
            <Form onSubmit={this.handleSubmit}>
                <Tabs activeKey={tab} onChange={this.handleChangeTab}>
                    {/* Basic info */}
                    <TabPane tab={localePkg.Client.Title.TaskBasic} key="basic">
                        <Item
                            validateStatus={nameError ? 'error' : 'success'}
                            help={nameError || ''}
                            label={localePkg.Model.Task.name}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('name', {
                                initialValue: defaultValue.name || '',
                                rules: [{
                                    max: formValidRules.strLength[1],
                                    message: getFormFieldErrorMsg(localePkg.Model.Task.name, [
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
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.name)} disabled={!isCreate} />
                            )}
                        </Item>
                        <Item
                            validateStatus={membersError ? 'error' : 'success'}
                            help={membersError || ''}
                            label={localePkg.Model.Task.members}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('members', {
                                initialValue: defaultValue.members ? defaultValue.members.map((item) => {
                                    return {
                                        key: item._id,
                                        label: item.nickname
                                    };
                                }) : []
                            })(
                                <MemberMultiSelect />
                            )}
                        </Item>
                        <Item className="text-right" {...tailFormItemLayout}>
                            <Button type="primary" loading={loading} onClick={() => this.handleChangeTab('rule')}>
                                {localePkg.Client.Action.next}
                            </Button>
                        </Item>
                    </TabPane>
                    {/* Task info*/}
                    <TabPane tab={localePkg.Client.Title.TaskRule} key="rule">
                        <Card title={localePkg.Model.UnionTask.taskItems}>
                            {taskItems.length === 0 ? (
                                <Alert message={getFormFieldErrorMsg(localePkg.Model.UnionTask.taskItems, [
                                    {
                                        type: 'required'
                                    }
                                ])} />
                            ) : <UnionTaskRule value={taskItems} onChange={this.handleModifyTaskModel} onRemove={this.handleRemoveTask} onDrag={this.handleDragTask} />}
                            <div className="text-center m-t"><Button onClick={() => this.handleModifyTaskModel('create')}>{localePkg.Client.Action.addTaskRule}</Button></div>
                        </Card>
                        <Item className="text-right" {...tailFormItemLayout}>
                            <Button loading={loading} onClick={() => this.handleChangeTab('basic')} className="m-r">
                                {localePkg.Client.Action.prev}
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())} loading={loading}>
                                {isCreate ? localePkg.Client.Action.create : localePkg.Client.Action.modify}
                            </Button>
                        </Item>
                    </TabPane>
                </Tabs>
                {/* Create task model*/}
                <Drawer
                    title={taskId === 'create' ? localePkg.Client.Action.create : localePkg.Client.Action.modify}
                    placement="right"
                    width="100%"
                    mask={false}
                    maskClosable={false}
                    onClose={this.handleCancelModifyTaskModel}
                    visible={taskId !== ''}
                >
                    {taskId !== '' ? (
                        <UnionTaskItemModifyForm defaultValue={taskItem || {}} isCreate={taskId === 'create'} onSubmit={this.handleModifyTask} loading={false} />
                    ) : <Loading />}
                </Drawer>
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
                result.members = result.members.map((item) => {
                    return item.key;
                });
                onSubmit(filterEmptyFields(result));
            }
        });
    }
    private handleChangeTab = (tab) => {
        this.setState({
            tab
        });
    }
    // Handle model for task rule modify
    private handleModifyTaskModel = (taskId: string) => {
        const {getFieldValue} = this.props.form;
        const taskItems: IUnionTaskSaveItem[] = getFieldValue('taskItems');
        let taskItem: any;
        if (taskId !== 'create') {
            taskItems.some((item) => {
                if (item.taskId === taskId) {
                    taskItem = item;
                    return true;
                }
                return false;
            });
        }
        this.setState({
            taskId,
            taskItem
        });
    }
    private handleCancelModifyTaskModel = () => {
        this.setState({
            taskId: ''
        });
    }
    private handleRemoveTask = (taskId: string) => {
        const {getFieldValue} = this.props.form;
        const taskItems: IUnionTaskSaveItem[] = getFieldValue('taskItems');
        const newTaskItems = taskItems.filter((item) => {
            return item.taskId !== taskId;
        });
        this.handleSetTaskitems(newTaskItems);
    }
    private handleSetTaskitems = (taskItems) => {
        const {validateFields, setFieldsValue} = this.props.form;
        setFieldsValue({
            taskItems
        });
        setTimeout(() => {
            validateFields();
        }, 0);
    }
    private handleDragTask = (dropKey: string, dragKey: string, dropPosition: number) => {
        const {getFieldValue} = this.props.form;
        const taskItems: IUnionTaskSaveItem[] = getFieldValue('taskItems');
        const newRuleItems = sortItems<IUnionTaskSaveItem, string>(taskItems, 'taskId', dropPosition, dropKey, dragKey);
        this.handleSetTaskitems(newRuleItems);
    }
    private handleModifyTask = (data) => {
        const {taskId} = this.state;
        const {getFieldValue} = this.props.form;
        const taskItems: IUnionTaskSaveItem[] = getFieldValue('taskItems');
        let newTaskItems: IUnionTaskSaveItem[];
        if (taskId === 'create') {
            newTaskItems = taskItems.concat([data]);
        } else {
            newTaskItems = taskItems.map((item) => {
                if (item.taskId === taskId) {
                    return data;
                }
                return item;
            });
        }
        this.handleSetTaskitems(newTaskItems);
        this.handleCancelModifyTaskModel();
    }
}

export default Form.create()(UnionTaskProfileModifyForm);
