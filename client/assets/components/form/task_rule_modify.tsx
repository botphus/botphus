import {Button, Form, Input, Select} from 'antd';
import * as React from 'react';
const {Item} = Form;
const {Option} = Select;

import {IModifyFormProps, INumEnumValueWithLabel} from '../../interfaces/common';
import {TaskType, TaskTypeDataSubType, TaskTypeDomSubType, TaskTypeEventSubType, TaskTypePageSubType, TaskTypeTimeSubType} from '../../types/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields, getNumEnumsList} from '../../lib/util';

const taskTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskType).filter((item) => {
    return localePkg.Enum.TaskType[item.key];
}).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskType[item.key]
    };
});

const taskTypeDataSubTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskTypeDataSubType).filter((item) => {
    return localePkg.Enum.TaskTypeDataSubType[item.key];
}).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskTypeDataSubType[item.key]
    };
});

const taskTypeDomSubTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskTypeDomSubType).filter((item) => {
    return localePkg.Enum.TaskTypeDomSubType[item.key];
}).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskTypeDomSubType[item.key]
    };
});

const taskTypeEventSubTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskTypeEventSubType).filter((item) => {
    return localePkg.Enum.TaskTypeEventSubType[item.key];
}).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskTypeEventSubType[item.key]
    };
});

const taskTypePageSubTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskTypePageSubType).filter((item) => {
    return localePkg.Enum.TaskTypePageSubType[item.key];
}).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskTypePageSubType[item.key]
    };
});

const taskTypeTimeSubTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskTypeTimeSubType).filter((item) => {
    return localePkg.Enum.TaskTypeTimeSubType[item.key];
}).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskTypeTimeSubType[item.key]
    };
});

class TaskRuleModifyForm extends React.Component<IModifyFormProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {defaultValue, isCreate, loading} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue, setFieldsValue, validateFields} = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const typeError = isFieldTouched('type') && getFieldError('type');
        const subTypeError = isFieldTouched('subType') && getFieldError('subType');
        const type = getFieldValue('type');
        let taskSubTypeList: INumEnumValueWithLabel[] = [];
        switch (type) {
            case TaskType.TYPE_DATA:
                taskSubTypeList = taskTypeDataSubTypeList;
                break;
            case TaskType.TYPE_DOM:
                taskSubTypeList = taskTypeDomSubTypeList;
                break;
            case TaskType.TYPE_EVENT:
                taskSubTypeList = taskTypeEventSubTypeList;
                break;
            case TaskType.TYPE_TIME:
                taskSubTypeList = taskTypeTimeSubTypeList;
                break;
            case TaskType.TYPE_PAGE:
                taskSubTypeList = taskTypePageSubTypeList;
                break;
        }
        return (
            <Form onSubmit={this.handleSubmit}>
                <Item
                    validateStatus={nameError ? 'error' : 'success'}
                    help={nameError || ''}
                    label={localePkg.Model.Task.ruleItem.name}
                    {...formItemLayout}
                >
                    {getFieldDecorator('name', {
                        initialValue: defaultValue.name || '',
                        rules: [{
                            max: formValidRules.strLength[1],
                            message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.name, [
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
                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.name)} />
                    )}
                </Item>
                <Item
                    validateStatus={typeError ? 'error' : 'success'}
                    help={typeError || ''}
                    label={localePkg.Model.Task.ruleItem.type}
                    {...formItemLayout}
                >
                    {getFieldDecorator('type', {
                        initialValue: defaultValue.type,
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.type, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }],
                    })(
                        <Select
                            placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Select, localePkg.Model.Task.ruleItem.type)}
                            onChange={() => {
                                setFieldsValue({
                                    subType: undefined
                                });
                                setTimeout(() => {
                                    validateFields();
                                }, 0);
                            }}
                        >
                            {taskTypeList.map((item, index) => {
                                return <Option key={index.toString()} value={item.value}>{item.label}</Option>;
                            })}
                        </Select>
                    )}
                </Item>
                <Item
                    validateStatus={subTypeError ? 'error' : 'success'}
                    help={subTypeError || ''}
                    label={localePkg.Model.Task.ruleItem.subType}
                    {...formItemLayout}
                >
                    {getFieldDecorator('subType', {
                        initialValue: defaultValue.subType,
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.subType, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }],
                    })(
                        <Select placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Select, localePkg.Model.Task.ruleItem.subType)}>
                            {taskSubTypeList.map((item, index) => {
                                return <Option key={index.toString()} value={item.value}>{item.label}</Option>;
                            })}
                        </Select>
                    )}
                </Item>
                <Item className="text-right" {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())} loading={loading}>
                        {isCreate ? localePkg.Client.Action.create : localePkg.Client.Action.modify}
                    </Button>
                </Item>
            </Form>
        );
    }
    private handleSubmit = (e: React.FormEvent<any>) => {
        const {onSubmit} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                onSubmit(filterEmptyFields(values));
            }
        });
    }
}

export default Form.create()(TaskRuleModifyForm);
