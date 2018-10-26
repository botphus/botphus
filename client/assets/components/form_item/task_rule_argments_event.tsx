/**
 * Task rule argments modify: data type
 */
import {Form, Input, InputNumber} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgmentsSubProps} from '../../interfaces/task';
import {TaskTypeEventSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgmentsEvent extends React.Component<ITaskRuleArgmentsSubProps> {
    public render() {
        const {argments, subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argmentsEventTimeoutError = isFieldTouched('argments.eventTimeout') && getFieldError('argments.eventTimeout');
        const argmentsEventPathError = isFieldTouched('argments.eventPath') && getFieldError('argments.eventPath');
        return (
            <div>
                <Item
                    validateStatus={argmentsEventTimeoutError ? 'error' : 'success'}
                    help={argmentsEventTimeoutError || localePkg.Client.Help.TaskRuleItem.argments.eventTimeout}
                    label={localePkg.Model.Task.ruleItem.argments.eventTimeout}
                    {...formItemLayout}
                >
                    {getFieldDecorator('argments.eventTimeout', {
                        initialValue: argments[0],
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.eventTimeout, [
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
                            placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.eventTimeout)}
                        />
                    )}
                </Item>
                {subType === TaskTypeEventSubType.SUB_TYPE_REQUEST || subType === TaskTypeEventSubType.SUB_TYPE_RESPONSE ? (
                    <Item
                        validateStatus={argmentsEventPathError ? 'error' : 'success'}
                        help={argmentsEventPathError || localePkg.Client.Help.TaskRuleItem.argments.eventPath}
                        label={localePkg.Model.Task.ruleItem.argments.eventPath}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.eventPath', {
                            initialValue: argments[1]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.eventPath)} />
                        )}
                    </Item>
                ) : null}
            </div>
        );
    }
}
