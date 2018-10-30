/**
 * Task rule arguments modify: data type
 */
import {Form, InputNumber} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgumentsSubProps} from '../../interfaces/task';
import {TaskTypeTimeSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgumentsTime extends React.Component<ITaskRuleArgumentsSubProps> {
    public render() {
        const {subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argumentsSleepTimeError = isFieldTouched('arguments.sleepTime') && getFieldError('arguments.sleepTime');
        switch (subType) {
            case TaskTypeTimeSubType.SUB_TYPE_SET_SLEEP:
                return (
                    <Item
                        validateStatus={argumentsSleepTimeError ? 'error' : 'success'}
                        help={argumentsSleepTimeError || ''}
                        label={localePkg.Model.Task.ruleItem.arguments.sleepTime}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.sleepTime', {
                            initialValue: this.props.arguments[0],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.sleepTime, [
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
                                placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.sleepTime)}
                            />
                        )}
                    </Item>
                );
            default:
                return null;
        }
    }
}
