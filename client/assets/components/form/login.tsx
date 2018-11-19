import {Button, Divider, Form, Icon, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {IFormProps} from '../../interfaces/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

interface ILoginFormProps extends IFormProps {
    authLogin?: boolean;
}

class LoginForm extends React.Component<ILoginFormProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {defaultValue, loading, authLogin} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const emailError = isFieldTouched('email') && getFieldError('email');
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
                        initialValue: defaultValue.email ? defaultValue.email.toString() : '',
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
                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.User.email)} />
                    )}
                </Item>
                <Item
                    validateStatus={passwordError ? 'error' : 'success'}
                    help={passwordError || ''}
                    label={localePkg.Model.User.password}
                    {...formItemLayout}
                >
                    {getFieldDecorator('password', {
                        initialValue: defaultValue.password ? defaultValue.password.toString() : '',
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
                        <Input type="password" placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.User.password)} />
                    )}
                </Item>
                <Item className="text-right" {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())} loading={loading}>{localePkg.Client.Action.login}</Button>
                </Item>
                {authLogin ? (
                    <div className="m-t text-center">
                        <Divider />
                        <a className="ant-btn" href="/auth-login/"><Icon type="safety-certificate" className="m-r-sm" />{localePkg.Client.Action.authLogin}</a>
                    </div>
                ) : null}
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

export default Form.create()(LoginForm);
