/**
 * Task rule argments modify: data type
 */
import {Form, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgmentsSubProps} from '../../interfaces/task';
import {TaskTypeDataSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgmentsData extends React.Component<ITaskRuleArgmentsSubProps> {
    public render() {
        const {argments, subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argmentsMysqlError = isFieldTouched('argments.mysql') && getFieldError('argments.mysql');
        const argmentsRedisError = isFieldTouched('argments.redis') && getFieldError('argments.redis');
        switch (subType) {
            case TaskTypeDataSubType.SUB_TYPE_MYSQL:
                return (
                    <Item
                        validateStatus={argmentsMysqlError ? 'error' : 'success'}
                        help={argmentsMysqlError || ''}
                        label={localePkg.Model.Task.ruleItem.argments.mysql}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.mysql', {
                            initialValue: argments[0],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.mysql, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input.TextArea rows={4} placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.mysql)} />
                        )}
                    </Item>
                );
            case TaskTypeDataSubType.SUB_TYPE_REDIS:
                return (
                    <Item
                        validateStatus={argmentsRedisError ? 'error' : 'success'}
                        help={argmentsRedisError || localePkg.Client.Help.TaskRuleItem.argments.redis}
                        label={localePkg.Model.Task.ruleItem.argments.redis}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.redis', {
                            initialValue: argments[0] ? argments[0].join(' ') : '',
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.redis, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.redis)} />
                        )}
                    </Item>
                );
            default:
                return null;
        }
    }
}
