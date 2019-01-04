import {Button, Col, Form, Input, Row, Select} from 'antd';
import * as React from 'react';
const {Item} = Form;
const {Option} = Select;

import {IFormProps, INumEnumValueWithLabel} from '../../interfaces/common';
import {TaskFlowStatus} from '../../types/common';

import {formInlineItemLayout, formValidRules, localePkg} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields, getNumEnumsList} from '../../lib/util';

const statusList: INumEnumValueWithLabel[] = getNumEnumsList(TaskFlowStatus).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskFlowStatus[item.key]
    };
});

class TaskFlowSearchForm extends React.Component<IFormProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {defaultValue, loading} = this.props;
        const {getFieldDecorator, getFieldsError} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="ant-advanced-search-form">
                <Row>
                    <Col span={8}>
                        <Item
                            label={localePkg.Model.TaskFlow.name}
                            {...formInlineItemLayout}
                        >
                            {getFieldDecorator('name', {
                                initialValue: defaultValue.name || '',
                                rules: [{
                                    max: formValidRules.strLength[1],
                                    message: getFormFieldErrorMsg(localePkg.Model.TaskFlow.name, [
                                        {
                                            args: formValidRules.strLength,
                                            type: 'length',
                                        }
                                    ]),
                                    min: formValidRules.strLength[0]
                                }],
                            })(
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.TaskFlow.name)} />
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item
                            label={localePkg.Model.TaskFlow.status}
                            {...formInlineItemLayout}
                        >
                            {getFieldDecorator('status', {
                                initialValue: defaultValue.status,
                            })(
                                <Select placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Select, localePkg.Model.TaskFlow.status)} allowClear>
                                    {statusList.map((item, index) => {
                                        return <Option key={index.toString()} value={item.value}>{item.label}</Option>;
                                    })}
                                </Select>
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Item className="text-right">
                        <Button className="m-r-sm" type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())} loading={loading}>
                            {localePkg.Client.Action.search}
                        </Button>
                    </Item>
                </Row>
            </Form>
        );
    }
    private handleSubmit = (e: React.FormEvent<any>) => {
        const {onSubmit} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                onSubmit(filterEmptyFields(values));
            }
        });
    }
}

export default Form.create()(TaskFlowSearchForm);
