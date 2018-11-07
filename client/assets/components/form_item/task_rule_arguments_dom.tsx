/**
 * Task rule arguments modify: data type
 */
import {Form, Input, Switch} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgumentsSubProps} from '../../interfaces/task';
import {TaskTypeDomSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgumentsDom extends React.Component<ITaskRuleArgumentsSubProps> {
    public render() {
        const {subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argumentsQuerySelectorError = isFieldTouched('arguments.querySelector') && getFieldError('arguments.querySelector');
        const argumentsHumanClickError = isFieldTouched('arguments.humanClick') && getFieldError('arguments.humanClick');
        const argumentsQuerySelectorTextError = isFieldTouched('arguments.querySelectorText') && getFieldError('arguments.querySelectorText');
        const argumentsQuerySelectorAttrNameError = isFieldTouched('arguments.querySelectorAttrName') && getFieldError('arguments.querySelectorAttrName');
        const argumentsQuerySelectorAttrValueError = isFieldTouched('arguments.querySelectorAttrValue') && getFieldError('arguments.querySelectorAttrValue');
        return (
            <div>
                <Item
                    validateStatus={argumentsQuerySelectorError ? 'error' : 'success'}
                    help={argumentsQuerySelectorError || localePkg.Client.Help.TaskRuleItem.arguments.querySelector}
                    label={localePkg.Model.Task.ruleItem.arguments.querySelector}
                    {...formItemLayout}
                >
                    {getFieldDecorator('arguments.querySelector', {
                        initialValue: this.props.arguments[0],
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.querySelector, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }]
                    })(
                        <Input.TextArea rows={4} placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.querySelector)} />
                    )}
                </Item>
                {subType === TaskTypeDomSubType.SUB_TYPE_CLICK ? (
                    <Item
                        validateStatus={argumentsHumanClickError ? 'error' : 'success'}
                        help={argumentsHumanClickError || localePkg.Client.Help.TaskRuleItem.arguments.querySelectorHumanClick}
                        label={localePkg.Model.Task.ruleItem.arguments.querySelectorHumanClick}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.humanClick', {
                            initialValue: typeof this.props.arguments[1] === 'boolean' ? this.props.arguments[1] : true,
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.querySelectorHumanClick, [
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
                {subType === TaskTypeDomSubType.SUB_TYPE_KEYBOARD ? (
                    <Item
                        validateStatus={argumentsHumanClickError ? 'error' : 'success'}
                        help={argumentsQuerySelectorTextError || ''}
                        label={localePkg.Model.Task.ruleItem.arguments.querySelectorText}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.querySelectorText', {
                            initialValue: this.props.arguments[1],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.querySelectorText, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input.TextArea rows={4} placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.querySelectorText)} />
                        )}
                    </Item>
                ) : null}
                {subType === TaskTypeDomSubType.SUB_TYPE_GET_ATTR || subType === TaskTypeDomSubType.SUB_TYPE_SET_ATTR ? (
                    <Item
                        validateStatus={argumentsQuerySelectorAttrNameError ? 'error' : 'success'}
                        help={argumentsQuerySelectorAttrNameError || ''}
                        label={localePkg.Model.Task.ruleItem.arguments.querySelectorAttrName}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.querySelectorAttrName', {
                            initialValue: this.props.arguments[1],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.querySelectorAttrName, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.querySelectorAttrName)} />
                        )}
                    </Item>
                ) : null}
                {subType === TaskTypeDomSubType.SUB_TYPE_SET_ATTR ? (
                    <Item
                        validateStatus={argumentsQuerySelectorAttrValueError ? 'error' : 'success'}
                        help={argumentsQuerySelectorAttrValueError || ''}
                        label={localePkg.Model.Task.ruleItem.arguments.querySelectorAttrValue}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.querySelectorAttrValue', {
                            initialValue: this.props.arguments[2],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.querySelectorAttrValue, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.querySelectorAttrValue)} />
                        )}
                    </Item>
                ) : null}
            </div>
        );
    }
}
