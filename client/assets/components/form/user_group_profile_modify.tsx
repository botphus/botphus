import {Button, Form, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {IModifyFormProps} from '../../interfaces/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields} from '../../lib/util';

import MemberMultiSelect from '../form_item/member_multi_select';

class UserGroupProfileModifyForm extends React.Component<IModifyFormProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {defaultValue, loading, isCreate} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const membersError = isFieldTouched('members') && getFieldError('members');
        return (
            <Form onSubmit={this.handleSubmit}>
                <Item
                    validateStatus={nameError ? 'error' : 'success'}
                    help={nameError || ''}
                    label={localePkg.Model.UserGroup.name}
                    {...formItemLayout}
                >
                    {getFieldDecorator('name', {
                        initialValue: defaultValue.name || '',
                        rules: [{
                            max: formValidRules.strLength[1],
                            message: getFormFieldErrorMsg(localePkg.Model.UserGroup.name, [
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
                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.UserGroup.name)} />
                    )}
                </Item>
                <Item
                    validateStatus={membersError ? 'error' : 'success'}
                    help={membersError || localePkg.Client.Help.UserGroup.members}
                    label={localePkg.Model.UserGroup.members}
                    {...formItemLayout}
                >
                    {getFieldDecorator('members', {
                        initialValue: defaultValue.members ? defaultValue.members.map((item) => {
                            return {
                                key: item._id,
                                label: item.nickname
                            };
                        }) : [],
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.UserGroup.members, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }],
                    })(
                        <MemberMultiSelect />
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
                result.members = result.members.map((item) => {
                    return item.key;
                });
                onSubmit(filterEmptyFields(result));
            }
        });
    }
}

export default Form.create()(UserGroupProfileModifyForm);
