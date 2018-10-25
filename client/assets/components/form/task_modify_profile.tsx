import {Alert, Button, Card, Drawer, Form, Input, Select, Tabs} from 'antd';
import * as cloneDeep from 'clone-deep';
import * as React from 'react';
const {Item} = Form;
const {TabPane} = Tabs;
const {Option} = Select;

import {IModifyFormProps, INumEnumValueWithLabel} from '../../interfaces/common';
import {TaskPageType, TaskSaveRuleTypeItem} from '../../types/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields, getNumEnumsList} from '../../lib/util';

import MemberMultiSelect from '../form_item/member_multi_select';
import TaskRule from '../form_item/task_rule';
import Loading from '../loading';
import TaskRuleItemWrapper from '../task_rule_wrapper';
import TaskRuleModifyForm from './task_rule_modify';

interface ITaskModifyProfileFormState {
    tab: 'basic' | 'rule';
    taskRuleIndex: string;
    taskRule?: TaskSaveRuleTypeItem;
}

const pageTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskPageType).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskPageType[item.key]
    };
});

class TaskModifyProfileForm extends React.Component<IModifyFormProps, ITaskModifyProfileFormState> {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'basic',
            taskRuleIndex: '',
        };
    }
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {tab, taskRule, taskRuleIndex} = this.state;
        const {defaultValue, loading, isCreate} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue} = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const pageTypeError = isFieldTouched('pageType') && getFieldError('pageType');
        const membersError = isFieldTouched('members') && getFieldError('members');
        getFieldDecorator('ruleItems', {
            initialValue: defaultValue.ruleItems || []
        });
        const ruleItems: TaskSaveRuleTypeItem[] = getFieldValue('ruleItems');
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
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.name)} />
                            )}
                        </Item>
                        <Item
                            validateStatus={pageTypeError ? 'error' : 'success'}
                            help={pageTypeError || ''}
                            label={localePkg.Model.Task.pageType}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('pageType', {
                                initialValue: defaultValue.pageType,
                                rules: [{
                                    message: getFormFieldErrorMsg(localePkg.Model.Task.pageType, [
                                        {
                                            type: 'required'
                                        }
                                    ]),
                                    required: true
                                }],
                            })(
                                <Select placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Select, localePkg.Model.Task.pageType)}>
                                    {pageTypeList.map((item, index) => {
                                        return <Option key={index.toString()} value={item.value}>{item.label}</Option>;
                                    })}
                                </Select>
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
                    {/* Rule info*/}
                    <TabPane tab={localePkg.Client.Title.TaskRule} key="rule">
                        <Card title={localePkg.Model.Task.ruleItems}>
                            {ruleItems.map((rule, index) => {
                                const componentIndex = index.toString();
                                return <TaskRuleItemWrapper key={componentIndex} index={componentIndex} rule={rule} onRender={(curRule, curIndex) => {
                                    return (
                                        <TaskRule index={curIndex} value={curRule} onChange={this.handleModifyRuleModel} onRemove={this.handleRemoveRule} />
                                    );
                                }} />;
                            })}
                            {ruleItems.length === 0 ? (
                                <Alert message={getFormFieldErrorMsg(localePkg.Model.Task.ruleItems, [
                                    {
                                        type: 'required'
                                    }
                                ])} />
                            ) : null}
                            <div className="text-center m-t"><Button onClick={() => this.handleModifyRuleModel('top')}>{localePkg.Client.Action.addTaskRule}</Button></div>
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
                {/* Create task rule model*/}
                <Drawer
                    title={taskRuleIndex === 'top' ? localePkg.Client.Action.create : localePkg.Client.Action.modify}
                    placement="right"
                    width="100%"
                    mask={false}
                    maskClosable={false}
                    onClose={this.handleCancelModifyRuleModel}
                    visible={!!taskRuleIndex}
                >
                    {taskRuleIndex ? (
                        <TaskRuleModifyForm defaultValue={taskRule || {}} isCreate={taskRuleIndex === 'top'} onSubmit={this.handleModifyRule} loading={false} />
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
    private handleModifyRuleModel = (taskRuleIndex: string, value?: TaskSaveRuleTypeItem) => {
        this.setState({
            taskRule: value,
            taskRuleIndex
        });
    }
    private handleCancelModifyRuleModel = () => {
        this.setState({
            taskRule: undefined,
            taskRuleIndex: '',
        });
    }
    // Handle modify rule item list
    private handleModifyRule = (value: TaskSaveRuleTypeItem) => {
        const {taskRuleIndex} = this.state;
        const {getFieldValue, setFieldsValue} = this.props.form;
        const ruleItems: TaskSaveRuleTypeItem[] = cloneDeep(getFieldValue('ruleItems'));
        // Create
        if (taskRuleIndex === 'top') {
            ruleItems.push(value);
        } else { // Replace value
            const taskRuleIndexList = taskRuleIndex.split('-');
            if (taskRuleIndexList.length === 1) {
                ruleItems[taskRuleIndex] = value;
            } else {
                let taskRuleItem: TaskSaveRuleTypeItem;
                taskRuleIndexList.forEach((key, index) => {
                    if (index === taskRuleIndexList.length - 1) {
                        taskRuleItem[index] = value;
                    } else {
                        taskRuleItem = ruleItems[key];
                    }
                });
            }
        }
        setFieldsValue({
            ruleItems
        });
        this.handleCancelModifyRuleModel();
    }
    private handleRemoveRule = () => {
        const {taskRuleIndex} = this.state;
        const {getFieldValue, setFieldsValue} = this.props.form;
        const ruleItems: TaskSaveRuleTypeItem[] = cloneDeep(getFieldValue('ruleItems'));
        const taskRuleIndexList = taskRuleIndex.split('-');
        if (taskRuleIndexList.length === 1) { // splice
            ruleItems.splice(parseInt(taskRuleIndex, 10), 1);
        } else {
            let taskRuleItem: TaskSaveRuleTypeItem;
            taskRuleIndexList.forEach((key, index) => {
                if (index === taskRuleIndexList.length - 1) {
                    taskRuleItem[index].splice(parseInt(key, 10), 1);
                } else {
                    taskRuleItem = ruleItems[key];
                }
            });
        }
        setFieldsValue({
            ruleItems
        });
    }
}

export default Form.create()(TaskModifyProfileForm);
