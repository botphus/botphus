/**
 * Task rule arguments modify: data type
 */
import {Form, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgumentsSubProps} from '../../interfaces/task';
import {TaskTypePageSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgumentsPage extends React.Component<ITaskRuleArgumentsSubProps> {
    public render() {
        const {subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argumentsGotoPathError = isFieldTouched('arguments.gotoPath') && getFieldError('arguments.gotoPath');
        switch (subType) {
            case TaskTypePageSubType.SUB_TYPE_GOTO:
                return (
                    <Item
                        validateStatus={argumentsGotoPathError ? 'error' : 'success'}
                        help={argumentsGotoPathError || ''}
                        label={localePkg.Model.Task.ruleItem.arguments.gotoPath}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('arguments.gotoPath', {
                            initialValue: this.props.arguments[0],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.arguments.gotoPath, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.arguments.gotoPath)} />
                        )}
                    </Item>
                );
            default:
                return null;
        }
    }
}
