import {Alert, Button, Card, Drawer, Form, Icon, Input, message, Select, Tabs} from 'antd';
import * as React from 'react';
const {Item} = Form;
const {TabPane} = Tabs;
const {Option} = Select;

import {IIndexMap, IModifyFormProps, INumEnumValueWithLabel} from '../../interfaces/common';
import {ITaskRuleSaveItem} from '../../interfaces/task';
import {TaskPageType} from '../../types/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {validRuleItems} from '../../lib/task';
import {filterEmptyFields, getNumEnumsList, sortItems} from '../../lib/util';

import MemberMultiSelect from '../form_item/member_multi_select';
import TaskRule from '../form_item/task_rule';
import Loading from '../loading';
import TaskRuleModifyForm from './task_rule_modify';

interface ITaskProfileModifyFormState {
    tab: 'basic' | 'rule';
    taskRuleId: number;
    taskRuleParentId: number;
    taskRule?: ITaskRuleSaveItem;
}

const pageTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskPageType).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskPageType[item.key]
    };
});

class TaskProfileModifyForm extends React.Component<IModifyFormProps, ITaskProfileModifyFormState> {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'basic',
            taskRuleId: -1,
            taskRuleParentId: 0,
        };
    }
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {tab, taskRule, taskRuleId} = this.state;
        const {defaultValue, loading, isCreate} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue} = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const pageTypeError = isFieldTouched('pageType') && getFieldError('pageType');
        const membersError = isFieldTouched('members') && getFieldError('members');
        getFieldDecorator('ruleItems', {
            initialValue: defaultValue.ruleItems || [],
            rules: [{
                required: true,
                type: 'array',
            }]
        });
        const ruleItems: ITaskRuleSaveItem[] = getFieldValue('ruleItems');
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
                        <Card title={localePkg.Model.Task.ruleItems} extra={(
                                <span>
                                    <Icon className="m-r-sm" type="info-circle" theme="filled" /><span className="text-light">{localePkg.Client.Help.taskRuleEventEmptyTip}</span>
                                </span>
                        )}>
                            {ruleItems.length === 0 ? (
                                <Alert message={getFormFieldErrorMsg(localePkg.Model.Task.ruleItems, [
                                    {
                                        type: 'required'
                                    }
                                ])} />
                            ) : <TaskRule value={ruleItems} onChange={this.handleModifyRuleModel} onRemove={this.handleRemoveRule} onDrag={this.handleDragRule} />}
                            <div className="text-center m-t"><Button onClick={() => this.handleModifyRuleModel(0, 0)}>{localePkg.Client.Action.addTaskRule}</Button></div>
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
                    title={taskRuleId === 0 ? localePkg.Client.Action.create : localePkg.Client.Action.modify}
                    placement="right"
                    width="100%"
                    mask={false}
                    maskClosable={false}
                    onClose={this.handleCancelModifyRuleModel}
                    visible={taskRuleId >= 0}
                >
                    {taskRuleId >= 0 ? (
                        <TaskRuleModifyForm defaultValue={taskRule || {}} isCreate={taskRuleId === 0} onSubmit={this.handleModifyRule} loading={false} />
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
                const ruleItemValidResult = validRuleItems(result.ruleItems);
                if (ruleItemValidResult) {
                    return message.error(ruleItemValidResult);
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
    // Handle model for task rule modify
    private handleModifyRuleModel = (taskRuleId: number, taskRuleParentId: number) => {
        const {getFieldValue} = this.props.form;
        const ruleItems: ITaskRuleSaveItem[] = getFieldValue('ruleItems');
        let taskRuleItem: any;
        if (taskRuleId > 0) {
            ruleItems.some((item) => {
                if (item.id === taskRuleId) {
                    taskRuleItem = item;
                    return true;
                }
                return false;
            });
        }
        this.setState({
            taskRule: taskRuleItem,
            taskRuleId,
            taskRuleParentId
        });
    }
    private handleCancelModifyRuleModel = () => {
        this.setState({
            taskRule: undefined,
            taskRuleId: -1,
            taskRuleParentId: 0
        });
    }
    // Handle modify rule item list
    private handleDragRule = (dropKey: number, dragKey: number, levelMap: IIndexMap<number>, dropPosition: number, dropId: number) => {
        const {getFieldValue} = this.props.form;
        const ruleItems: ITaskRuleSaveItem[] = getFieldValue('ruleItems');
        let newRuleItems = ruleItems.map((item) => {
            // Reset drag info
            if (item.id === dragKey) {
                return {
                    ...item,
                    level: levelMap[item.id],
                    pid: dropKey
                };
            // Reset level
            } else if (levelMap[item.id]) {
                return {
                    ...item,
                    level: levelMap[item.id]
                };
            }
            return item;
        });
        // if dropPosition means sort, Change sort
        if (dropPosition !== 0) {
            newRuleItems = sortItems<ITaskRuleSaveItem, number>(newRuleItems, 'id', dropPosition, dropId, dragKey);
        }
        this.handleSetRuleitems(newRuleItems);
    }
    private handleModifyRule = (data) => {
        const {taskRuleId, taskRuleParentId} = this.state;
        const {getFieldValue} = this.props.form;
        const ruleItems: ITaskRuleSaveItem[] = getFieldValue('ruleItems');
        let taskParentRuleItem: any;
        let maxId: number = 1;
        ruleItems.forEach((item) => {
            if (item.id === taskRuleParentId) {
                taskParentRuleItem = item;
            }
            if (item.id > maxId) {
                maxId = item.id;
            }
        });
        const saveRuleItem: ITaskRuleSaveItem = {
            ...data,
            id: taskRuleId > 0 ? taskRuleId : maxId + 1,
            level: taskParentRuleItem ? taskParentRuleItem.level + 1 : 0,
            pid: taskRuleParentId,
        };
        let newRuleItems: ITaskRuleSaveItem[];
        if (taskRuleId > 0) {
            newRuleItems = ruleItems.map((item) => {
                if (item.id === taskRuleId) {
                    return saveRuleItem;
                }
                return item;
            });
        } else {
            newRuleItems = ruleItems.concat([saveRuleItem]);
        }
        this.handleSetRuleitems(newRuleItems);
        this.handleCancelModifyRuleModel();
    }
    private handleRemoveRule = (levelMap: IIndexMap<number>) => {
        const {getFieldValue} = this.props.form;
        const ruleItems: ITaskRuleSaveItem[] = getFieldValue('ruleItems');
        const newRuleItems = ruleItems.filter((item) => {
            return !(levelMap[item.id] >= 0);
        });
        this.handleSetRuleitems(newRuleItems);
    }
    private handleSetRuleitems = (ruleItems) => {
        const {validateFields, setFieldsValue} = this.props.form;
        // Sort task
        ruleItems = ruleItems.map((item, index) => {
            return {
                ...item,
                index
            };
        }).sort((before, after) => {
            return (before.level - after.level) *  10000 + (before.index - after.index);
        });
        ruleItems.forEach((item) => {
            delete item.index;
        });
        setFieldsValue({
            ruleItems
        });
        setTimeout(() => {
            validateFields();
        }, 0);
    }
}

export default Form.create()(TaskProfileModifyForm);
