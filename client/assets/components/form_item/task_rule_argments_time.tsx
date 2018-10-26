/**
 * Task rule argments modify: data type
 */
import {Form, InputNumber} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgmentsSubProps} from '../../interfaces/task';
import {TaskTypeTimeSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgmentsTime extends React.Component<ITaskRuleArgmentsSubProps> {
    public render() {
        const {argments, subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argmentsSleepTimeError = isFieldTouched('argments.sleepTime') && getFieldError('argments.sleepTime');
        switch (subType) {
            case TaskTypeTimeSubType.SUB_TYPE_SET_SLEEP:
                return (
                    <Item
                        validateStatus={argmentsSleepTimeError ? 'error' : 'success'}
                        help={argmentsSleepTimeError || ''}
                        label={localePkg.Model.Task.ruleItem.argments.sleepTime}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.sleepTime', {
                            initialValue: argments[0],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.sleepTime, [
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
                                placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.sleepTime)}
                            />
                        )}
                    </Item>
                );
            default:
                return null;
        }
    }
}
