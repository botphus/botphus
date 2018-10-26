/**
 * Task rule argments modify: data type
 */
import {Form, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgmentsSubProps} from '../../interfaces/task';
import {TaskTypeDomSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgmentsDom extends React.Component<ITaskRuleArgmentsSubProps> {
    public render() {
        const {argments, subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argmentsQuerySelectorError = isFieldTouched('argments.querySelector') && getFieldError('argments.querySelector');
        const argmentsQuerySelectorTextError = isFieldTouched('argments.querySelectorText') && getFieldError('argments.querySelectorText');
        const argmentsQuerySelectorAttrNameError = isFieldTouched('argments.querySelectorAttrName') && getFieldError('argments.querySelectorAttrName');
        const argmentsQuerySelectorAttrValueError = isFieldTouched('argments.querySelectorAttrValue') && getFieldError('argments.querySelectorAttrValue');
        return (
            <div>
                <Item
                    validateStatus={argmentsQuerySelectorError ? 'error' : 'success'}
                    help={argmentsQuerySelectorError || localePkg.Client.Help.TaskRuleItem.argments.querySelector}
                    label={localePkg.Model.Task.ruleItem.argments.querySelector}
                    {...formItemLayout}
                >
                    {getFieldDecorator('argments.querySelector', {
                        initialValue: argments[0],
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.querySelector, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }]
                    })(
                        <Input.TextArea rows={4} placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.querySelector)} />
                    )}
                </Item>
                {subType === TaskTypeDomSubType.SUB_TYPE_KEYBOARD ? (
                    <Item
                        validateStatus={argmentsQuerySelectorTextError ? 'error' : 'success'}
                        help={argmentsQuerySelectorTextError || ''}
                        label={localePkg.Model.Task.ruleItem.argments.querySelectorText}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.querySelectorText', {
                            initialValue: argments[1],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.querySelectorText, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input.TextArea rows={4} placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.querySelectorText)} />
                        )}
                    </Item>
                ) : null}
                {subType === TaskTypeDomSubType.SUB_TYPE_GET_ATTR || subType === TaskTypeDomSubType.SUB_TYPE_SET_ATTR ? (
                    <Item
                        validateStatus={argmentsQuerySelectorAttrNameError ? 'error' : 'success'}
                        help={argmentsQuerySelectorAttrNameError || ''}
                        label={localePkg.Model.Task.ruleItem.argments.querySelectorAttrName}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.querySelectorAttrName', {
                            initialValue: argments[1],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.querySelectorAttrName, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.querySelectorAttrName)} />
                        )}
                    </Item>
                ) : null}
                {subType === TaskTypeDomSubType.SUB_TYPE_SET_ATTR ? (
                    <Item
                        validateStatus={argmentsQuerySelectorAttrValueError ? 'error' : 'success'}
                        help={argmentsQuerySelectorAttrValueError || ''}
                        label={localePkg.Model.Task.ruleItem.argments.querySelectorAttrValue}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.querySelectorAttrValue', {
                            initialValue: argments[2],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.querySelectorAttrValue, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.querySelectorAttrValue)} />
                        )}
                    </Item>
                ) : null}
            </div>
        );
    }
}
