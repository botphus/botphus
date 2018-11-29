import {Button, Form, Input, Switch} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {IModifyFormProps} from '../../interfaces/common';
import {RequestAction} from '../../types/request';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields} from '../../lib/util';

import SearchSelect from '../form_item/search_select';

class UnionTaskItemModifyForm extends React.Component<IModifyFormProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {defaultValue, isCreate, loading} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const taskInfoError = isFieldTouched('taskInfo') && getFieldError('taskInfo');
        const startPageError = isFieldTouched('startPage') && getFieldError('startPage');
        const ignoreErrorError = isFieldTouched('ignoreError') && getFieldError('ignoreError');
        return (
            <Form onSubmit={this.handleSubmit}>
                <Item
                    validateStatus={taskInfoError ? 'error' : 'success'}
                    help={taskInfoError || ''}
                    label={localePkg.Model.UnionTask.taskItem.taskId}
                    {...formItemLayout}
                >
                    {getFieldDecorator('taskInfo', {
                        initialValue: defaultValue.taskId ? {
                            key: defaultValue.taskId, label: defaultValue.name
                        } : undefined,
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.UnionTask.taskItem.taskId, [
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
                <Item
                    validateStatus={startPageError ? 'error' : 'success'}
                    help={startPageError || localePkg.Client.Help.UnionTask.startPage}
                    label={localePkg.Model.UnionTask.taskItem.startPage}
                    {...formItemLayout}
                >
                    {getFieldDecorator('startPage', {
                        initialValue: defaultValue.startPage || '',
                        rules: [{
                            max: formValidRules.urlLength[1],
                            message: getFormFieldErrorMsg(localePkg.Model.UnionTask.taskItem.startPage, [
                                {
                                    args: formValidRules.urlLength,
                                    type: 'length',
                                }
                            ]),
                            min: formValidRules.urlLength[0]
                        }],
                    })(
                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.UnionTask.taskItem.startPage)} />
                    )}
                </Item>
                <Item
                    validateStatus={ignoreErrorError ? 'error' : 'success'}
                    help={ignoreErrorError || localePkg.Client.Help.UnionTask.ignoreError}
                    label={localePkg.Model.UnionTask.taskItem.ignoreError}
                    {...formItemLayout}
                >
                    {getFieldDecorator('ignoreError', {
                        initialValue: typeof defaultValue.ignoreError === 'boolean' ? defaultValue.ignoreError : false,
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.UnionTask.taskItem.ignoreError, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }],
                        valuePropName: 'checked',
                    })(
                        <Switch />
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
                const result = {...values};
                if (result.taskInfo) {
                    result.taskId = result.taskInfo.key;
                    result.name = result.taskInfo.label;
                    delete result.taskInfo;
                }
                onSubmit(filterEmptyFields(result));
            }
        });
    }
}

export default Form.create()(UnionTaskItemModifyForm);
