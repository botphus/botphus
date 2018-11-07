import {Button, Checkbox, Form, Input, Switch} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {IModifyFormProps} from '../../interfaces/common';
import {UserPermissionCode} from '../../types/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields, getNumEnumsList} from '../../lib/util';

interface ICreateProfileProps extends IModifyFormProps {
    permission?: boolean;
}

const permissionList = getNumEnumsList(UserPermissionCode).filter((item) => {
    // Filter root & login
    return item.value > 1;
});

class UserProfileModifyForm extends React.Component<ICreateProfileProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {defaultValue, permission, isCreate, loading} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const emailError = isFieldTouched('email') && getFieldError('email');
        const nicknameError = isFieldTouched('nickname') && getFieldError('nickname');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const permissionError = isFieldTouched('permission') && getFieldError('permission');
        const enableError = isFieldTouched('enable') && getFieldError('enable');
        return (
            <Form onSubmit={this.handleSubmit}>
                <Item
                    validateStatus={emailError ? 'error' : 'success'}
                    help={emailError || ''}
                    label={localePkg.Model.User.email}
                    {...formItemLayout}
                >
                    {getFieldDecorator('email', {
                        initialValue: defaultValue.email || '',
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
                    validateStatus={nicknameError ? 'error' : 'success'}
                    help={nicknameError || ''}
                    label={localePkg.Model.User.nickname}
                    {...formItemLayout}
                >
                    {getFieldDecorator('nickname', {
                        initialValue: defaultValue.nickname || '',
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
                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.User.nickname)} />
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
                            message: getFormFieldErrorMsg(localePkg.Model.User.password, isCreate ? [
                                {
                                    type: 'required'
                                },
                                {
                                    args: formValidRules.strLength,
                                    type: 'length',
                                }
                            ] : [
                                {
                                    args: formValidRules.strLength,
                                    type: 'length',
                                }
                            ]),
                            min: formValidRules.strLength[0],
                            required: isCreate
                        }],
                    })(
                        <Input type="password" placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.User.password)} />
                    )}
                </Item>
                {permission ? (
                    <Item
                        validateStatus={permissionError ? 'error' : 'success'}
                        help={permissionError || ''}
                        label={localePkg.Model.User.permission}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('permission', {
                            initialValue: defaultValue.permission ? permissionList.filter((item) => {
                                return (defaultValue.permission & item.value) > 0;
                            }).map((item) => {
                                return item.value;
                            }) : []
                        })(
                            <Checkbox.Group>
                                {permissionList.map((item, index) => {
                                    return (
                                        <Checkbox key={index.toString()} value={item.value}>
                                            {localePkg.Enum.UserPermissionCode[item.key]}
                                        </Checkbox>
                                    );
                                })}
                            </Checkbox.Group>
                        )}
                    </Item>
                ) : null}
                {permission ? (
                    <Item
                        validateStatus={enableError ? 'error' : 'success'}
                        help={enableError || ''}
                        label={localePkg.Model.User.enable}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('enable', {
                            initialValue: typeof defaultValue.enable === 'boolean' ? defaultValue.enable : true,
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.User.enable, [
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
                ) : null}
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
                if (values.permission) {
                    let permission: number = 0;
                    values.permission.forEach((permissionCode) => {
                        permission = permission ^ permissionCode;
                    });
                    result.permission = permission;
                }
                onSubmit(filterEmptyFields(result));
            }
        });
    }
}

export default Form.create()(UserProfileModifyForm);
