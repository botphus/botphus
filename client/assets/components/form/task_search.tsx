import {Button, Col, Form, Input, Row, Select} from 'antd';
import * as React from 'react';
const {Item} = Form;
const {Option} = Select;

import {IFormProps, INumEnumValueWithLabel} from '../../interfaces/common';
import {TaskPageType} from '../../types/common';

import {formInlineItemLayout, formValidRules, localePkg} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields, getNumEnumsList} from '../../lib/util';

const pageTypeList: INumEnumValueWithLabel[] = getNumEnumsList(TaskPageType).map((item) => {
    return {
        ...item,
        label: localePkg.Enum.TaskPageType[item.key]
    };
});

class TaskSearchForm extends React.Component<IFormProps> {
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
                            label={localePkg.Model.Task.name}
                            {...formInlineItemLayout}
                        >
                            {getFieldDecorator('name', {
                                initialValue: defaultValue.name || '',
                                rules: [{
                                    max: formValidRules.strLength[1],
                                    message: getFormFieldErrorMsg(localePkg.Model.Task.name, [
                                        {
                                            args: formValidRules.strLength,
                                            type: 'length',
                                        }
                                    ]),
                                    min: formValidRules.strLength[0]
                                }],
                            })(
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Task.name)} />
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item
                            label={localePkg.Model.Task.pageType}
                            {...formInlineItemLayout}
                        >
                            {getFieldDecorator('pageType', {
                                initialValue: defaultValue.pageType,
                            })(
                                <Select placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Select, localePkg.Model.Task.pageType)} allowClear>
                                    {pageTypeList.map((item, index) => {
                                        return <Option key={index.toString()} value={item.value}>{item.label}</Option>;
                                    })}
                                </Select>
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Item className="text-right">
                        <Button className="m-r-sm" type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())} loading={loading}>搜索</Button>
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

export default Form.create()(TaskSearchForm);
