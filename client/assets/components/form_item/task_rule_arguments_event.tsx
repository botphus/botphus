/**
 * Task rule arguments modify: data type
 */
import {Form, Input, InputNumber} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgumentsSubProps} from '../../interfaces/task';
import {TaskTypeEventSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgumentsEvent extends React.Component<ITaskRuleArgumentsSubProps> {
    public render() {
        const {subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argumentsEventTimeoutError = isFieldTouched('arguments.eventTimeout') && getFieldError('arguments.eventTimeout');
        const argumentsEventPathError = isFieldTouched('arguments.eventPath') && getFieldError('arguments.eventPath');
        return (
            <div>
                <Item
                    validateStatus={argumentsEventTimeoutError ? 'error' : 'success'}
                    help={argumentsEventTimeoutError || localePkg.Client.Help.TaskRuleItem.arguments.eventTimeout}
                    label={localePkg.Model.Task.ruleItem.arguments.eventTimeout}
                    {...formItemLayout}
                >
                    {getFieldDecorator('arguments.eventTimeout', {
                        initialValue: this.props.arguments[0],
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.eventTimeout, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }]
                    })(
                        <InputNumber
                            step={1} min={100}
                            style={{width: 200, maxWidth: '100%'}}
                            placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.eventTimeout)}
                        />
                    )}
                </Item>
                {subType === TaskTypeEventSubType.SUB_TYPE_REQUEST || subType === TaskTypeEventSubType.SUB_TYPE_RESPONSE ? (
                    <Item
                        validateStatus={argumentsEventPathError ? 'error' : 'success'}
                        help={argumentsEventPathError || localePkg.Client.Help.TaskRuleItem.arguments.eventPath}
                        label={localePkg.Model.Task.ruleItem.arguments.eventPath}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.eventPath', {
                            initialValue: this.props.arguments[1]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.eventPath)} />
                        )}
                    </Item>
                ) : null}
            </div>
        );
    }
}
