/**
 * Task rule argments modify: data type
 */
import {Form, Input} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {ITaskRuleArgmentsSubProps} from '../../interfaces/task';
import {TaskTypePageSubType} from '../../types/common';

import {formItemLayout, localePkg} from '../../lib/const';
import {getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';

export default class TaskRuleArgmentsPage extends React.Component<ITaskRuleArgmentsSubProps> {
    public render() {
        const {argments, subType} = this.props;
        const {getFieldDecorator, getFieldError, isFieldTouched} = this.props.form;
        const argmentsGotoPathError = isFieldTouched('argments.gotoPath') && getFieldError('argments.gotoPath');
        switch (subType) {
            case TaskTypePageSubType.SUB_TYPE_GOTO:
                return (
                    <Item
                        validateStatus={argmentsGotoPathError ? 'error' : 'success'}
                        help={argmentsGotoPathError || ''}
                        label={localePkg.Model.Task.ruleItem.argments.gotoPath}
                        {...formItemLayout}
                    >
                        {getFieldDecorator('argments.gotoPath', {
                            initialValue: argments[0],
                            rules: [{
                                message: getFormFieldErrorMsg(localePkg.Model.Task.ruleItem.argments.gotoPath, [
                                    {
                                        type: 'required'
                                    }
                                ]),
                                required: true
                            }]
                        })(
                            <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.ruleItem.argments.gotoPath)} />
                        )}
                    </Item>
                );
            default:
                return null;
        }
    }
}
