import {Button, Form, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {IFormProps} from '../../interfaces/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg} from '../../lib/form';

class CreateProfileForm extends React.Component<IFormProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const emailError = isFieldTouched('email') && getFieldError('email');
        const nicknameError = isFieldTouched('nickname') && getFieldError('nickname');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <Form onSubmit={this.handleSubmit}>
                <Item
                    validateStatus={emailError ? 'error' : 'success'}
                    help={emailError || ''}
                    label={localePkg.Model.User.email}
                    {...formItemLayout}
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            max: formValidRules.emailLength[1],
                            message: getFormFieldErrorMsg(localePkg.Model.User.email, [
                                {
                                    type: 'required'
                                },
                                {
                                    args: formValidRules.emailLength,
                                    type: 'length',
                                }
                            ]),
                            min: formValidRules.emailLength[0],
                            required: true
                        }],
                    })(
                        <Input />
                    )}
                </Item>
                <Item
                    validateStatus={nicknameError ? 'error' : 'success'}
                    help={nicknameError || ''}
                    label={localePkg.Model.User.nickname}
                    {...formItemLayout}
                >
                    {getFieldDecorator('nickname', {
                        rules: [{
                            max: formValidRules.strLength[1],
                            message: getFormFieldErrorMsg(localePkg.Model.User.nickname, [
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
                        <Input />
                    )}
                </Item>
                <Item
                    validateStatus={passwordError ? 'error' : 'success'}
                    help={passwordError || ''}
                    label={localePkg.Model.User.password}
                    {...formItemLayout}
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            max: formValidRules.strLength[1],
                            message: getFormFieldErrorMsg(localePkg.Model.User.password, [
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
                        <Input type="password" />
                    )}
                </Item>
                <Item className="text-right" {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())}>{localePkg.Client.Action.create}</Button>
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
                onSubmit(values);
            }
        });
    }
}

export default Form.create()(CreateProfileForm);
