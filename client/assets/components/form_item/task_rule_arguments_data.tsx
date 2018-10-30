/**
 * Task rule arguments modify: data type
 */
import {Form, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgumentsSubProps} from '../../interfaces/task';
import {TaskTypeDataSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgumentsData extends React.Component<ITaskRuleArgumentsSubProps> {
    public render() {
        const {subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argumentsMysqlError = isFieldTouched('arguments.mysql') && getFieldError('arguments.mysql');
        const argumentsRedisError = isFieldTouched('arguments.redis') && getFieldError('arguments.redis');
        switch (subType) {
            case TaskTypeDataSubType.SUB_TYPE_MYSQL:
                return (
                    <Item
                        validateStatus={argumentsMysqlError ? 'error' : 'success'}
                        help={argumentsMysqlError || ''}
                        label={localePkg.Model.Task.ruleItem.arguments.mysql}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.mysql', {
                            initialValue: this.props.arguments[0],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.mysql, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input.TextArea rows={4} placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.mysql)} />
                        )}
                    </Item>
                );
            case TaskTypeDataSubType.SUB_TYPE_REDIS:
                return (
                    <Item
                        validateStatus={argumentsRedisError ? 'error' : 'success'}
                        help={argumentsRedisError || localePkg.Client.Help.TaskRuleItem.arguments.redis}
                        label={localePkg.Model.Task.ruleItem.arguments.redis}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.redis', {
                            initialValue: this.props.arguments[0] ? this.props.arguments[0].join(' ') : '',
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.redis, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.redis)} />
                        )}
                    </Item>
                );
            default:
                return null;
        }
    }
}
