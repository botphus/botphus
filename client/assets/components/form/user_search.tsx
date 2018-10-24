import {Button, Col, Form, Input, Row} from 'antd';
import * as React from 'react';
const {Item} = Form;

import {IFormProps} from '../../interfaces/common';

import {formInlineItemLayout, formValidRules, localePkg} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields} from '../../lib/util';

class UserSearchForm extends React.Component<IFormProps> {
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
                            label={localePkg.Model.User.email}
                            {...formInlineItemLayout}
                        >
                            {getFieldDecorator('email', {
                                initialValue: defaultValue.email || '',
                                rules: [{
                                    max: formValidRules.emailLength[1],
                                    message: getFormFieldErrorMsg(localePkg.Model.User.email, [
                                        {
                                            args: formValidRules.emailLength,
                                            type: 'length',
                                        }
                                    ]),
                                    min: formValidRules.emailLength[0]
                                }],
                            })(
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.User.email)} />
                            )}
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item
                            label={localePkg.Model.User.nickname}
                            {...formInlineItemLayout}
                        >
                            {getFieldDecorator('nickname', {
                                initialValue: defaultValue.nickname || '',
                                rules: [{
                                    max: formValidRules.strLength[1],
                                    message: getFormFieldErrorMsg(localePkg.Model.User.nickname, [
                                        {
                                            args: formValidRules.strLength,
                                            type: 'length',
                                        }
                                    ]),
                                    min: formValidRules.strLength[0]
                                }],
                            })(
                                <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.User.nickname)} />
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

export default Form.create()(UserSearchForm);
