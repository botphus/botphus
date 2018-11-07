import {Button, Card, Form, Input, InputNumber, Select} from 'antd';
import * as React from 'react';
const {Item} = Form;
const {Option} = Select;

import {IModifyFormProps} from '../../interfaces/common';
import {ConnectionType} from '../../types/common';

import {formItemLayout, formValidRules, localePkg, tailFormItemLayout} from '../../lib/const';
import {formHasErrors, getFormFieldErrorMsg, getFormFieldPlaceholder} from '../../lib/form';
import {filterEmptyFields, getNumEnumsList} from '../../lib/util';

const typeList = getNumEnumsList(ConnectionType);

class ConnectionProfileModifyForm extends React.Component<IModifyFormProps> {
    public componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    public render() {
        const {defaultValue, loading, isCreate} = this.props;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue, validateFields} = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const typeError = isFieldTouched('type') && getFieldError('type');
        const type = getFieldValue('type');
        const defaultRedisConfig = defaultValue.type === ConnectionType.REDIS && defaultValue.config ?
        (Array.isArray(defaultValue.config) ? defaultValue.config : [defaultValue.config]) : [{
            port: 6379
        }];
        getFieldDecorator('redisKeys', {
            initialValue: defaultRedisConfig.map((_item, index) => {
                return index;
            })
        });
        const redisKeys: number[] = getFieldValue('redisKeys');
        return (
            <Form onSubmit={this.handleSubmit}>
                <Item
                    validateStatus={nameError ? 'error' : 'success'}
                    help={nameError || ''}
                    label={localePkg.Model.Connection.name}
                    {...formItemLayout}
                >
                    {getFieldDecorator('name', {
                        initialValue: defaultValue.name || '',
                        rules: [{
                            max: formValidRules.strLength[1],
                            message: getFormFieldErrorMsg(localePkg.Model.Connection.name, [
                                {
                                    type: 'required'
                                },
                                {
                                    args: formValidRules.strLength,
                                    type: 'length',
                                }
                            ]),
                            min: formValidRules.strLength[0],
                            required: true
                        }],
                    })(
                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.name)} />
                    )}
                </Item>
                <Item
                    validateStatus={typeError ? 'error' : 'success'}
                    help={typeError || ''}
                    label={localePkg.Model.Connection.type}
                    {...formItemLayout}
                >
                    {getFieldDecorator('type', {
                        initialValue: defaultValue.type,
                        rules: [{
                            message: getFormFieldErrorMsg(localePkg.Model.Connection.type, [
                                {
                                    type: 'required'
                                }
                            ]),
                            required: true
                        }],
                    })(
                        <Select
                            placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Select, localePkg.Model.Connection.type)}
                            onChange={() => {
                                setTimeout(() => {
                                    validateFields();
                                }, 0);
                            }}
                        >
                            {typeList.map((item, index) => {
                                return <Option key={index.toString()} value={item.value}>{localePkg.Enum.ConnectionType[item.key]}</Option>;
                            })}
                        </Select>
                    )}
                </Item>
                {type ? (
                    <Card title={localePkg.Model.Connection.config} className="m-b">
                        {/* Mysql config */}
                        {type === ConnectionType.MYSQL ? (
                            <div className="m-b">
                                <Item
                                    label={localePkg.Model.Connection.mysqlConfig.host}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('config.host', {
                                        initialValue: defaultValue.config ? defaultValue.config.host : '',
                                        rules: [{
                                            max: formValidRules.strLength[1],
                                            message: getFormFieldErrorMsg(localePkg.Model.Connection.mysqlConfig.host, [
                                                {
                                                    type: 'required'
                                                },
                                                {
                                                    args: formValidRules.strLength,
                                                    type: 'length',
                                                }
                                            ]),
                                            min: formValidRules.strLength[0],
                                            required: true
                                        }],
                                    })(
                                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.mysqlConfig.host)} />
                                    )}
                                </Item>
                                <Item
                                    label={localePkg.Model.Connection.mysqlConfig.port}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('config.port', {
                                        initialValue: defaultValue.config ? defaultValue.config.port : 3306,
                                        rules: [{
                                            message: getFormFieldErrorMsg(localePkg.Model.Connection.mysqlConfig.port, [
                                                {
                                                    type: 'required'
                                                }
                                            ]),
                                            required: true
                                        }],
                                    })(
                                        <InputNumber step={1} min={1}
                                            placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.mysqlConfig.port)}
                                        />
                                    )}
                                </Item>
                                <Item
                                    label={localePkg.Model.Connection.mysqlConfig.database}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('config.database', {
                                        initialValue: defaultValue.config ? defaultValue.config.database : '',
                                        rules: [{
                                            max: formValidRules.strLength[1],
                                            message: getFormFieldErrorMsg(localePkg.Model.Connection.mysqlConfig.database, [
                                                {
                                                    type: 'required'
                                                },
                                                {
                                                    args: formValidRules.strLength,
                                                    type: 'length',
                                                }
                                            ]),
                                            min: formValidRules.strLength[0],
                                            required: true
                                        }],
                                    })(
                                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.mysqlConfig.database)} />
                                    )}
                                </Item>
                                <Item
                                    label={localePkg.Model.Connection.mysqlConfig.user}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('config.user', {
                                        initialValue: defaultValue.config ? defaultValue.config.user : '',
                                        rules: [{
                                            max: formValidRules.strLength[1],
                                            message: getFormFieldErrorMsg(localePkg.Model.Connection.mysqlConfig.user, [
                                                {
                                                    type: 'required'
                                                },
                                                {
                                                    args: formValidRules.strLength,
                                                    type: 'length',
                                                }
                                            ]),
                                            min: formValidRules.strLength[0],
                                            required: true
                                        }],
                                    })(
                                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.mysqlConfig.user)} />
                                    )}
                                </Item>
                                <Item
                                    label={localePkg.Model.Connection.mysqlConfig.password}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('config.password', {
                                        initialValue: defaultValue.config ? defaultValue.config.password : '',
                                        rules: [{
                                            max: formValidRules.strLength[1],
                                            message: getFormFieldErrorMsg(localePkg.Model.Connection.mysqlConfig.password, [
                                                {
                                                    args: formValidRules.strLength,
                                                    type: 'length',
                                                }
                                            ]),
                                            min: formValidRules.strLength[0]
                                        }],
                                    })(
                                        <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.mysqlConfig.password)} />
                                    )}
                                </Item>
                            </div>
                        ) : null}
                        {/* Redis config */}
                        {type === ConnectionType.REDIS ? (
                            <div>
                                {redisKeys.map((key, index) => {
                                    return (
                                        <Card className="m-b" key={key}
                                            title={redisKeys.length > 1 ?
                                                `${localePkg.Client.Title.ConnectionRedisClusterConfig}:${index + 1}` : localePkg.Client.Title.ConnectionRedisConfig
                                            }
                                            extra={index > 0 ? (
                                                <Button type="danger" onClick={() => this.handleRemoveKey(key)}>{localePkg.Client.Action.remove}</Button>
                                            ) : null}
                                        >
                                            <Item
                                                label={localePkg.Model.Connection.redisConfig.host}
                                                {...formItemLayout}
                                            >
                                                {getFieldDecorator(`config[${key}].host`, {
                                                    initialValue: defaultRedisConfig[key] ? defaultRedisConfig[key].host : '',
                                                    rules: [{
                                                        max: formValidRules.strLength[1],
                                                        message: getFormFieldErrorMsg(localePkg.Model.Connection.redisConfig.host, [
                                                            {
                                                                type: 'required'
                                                            },
                                                            {
                                                                args: formValidRules.strLength,
                                                                type: 'length',
                                                            }
                                                        ]),
                                                        min: formValidRules.strLength[0],
                                                        required: true
                                                    }],
                                                })(
                                                    <Input placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.redisConfig.host)} />
                                                )}
                                            </Item>
                                            <Item
                                                label={localePkg.Model.Connection.redisConfig.port}
                                                {...formItemLayout}
                                            >
                                                {getFieldDecorator(`config[${key}].port`, {
                                                    initialValue: defaultRedisConfig[key] ? defaultRedisConfig[key].port : 6379,
                                                    rules: [{
                                                        message: getFormFieldErrorMsg(localePkg.Model.Connection.redisConfig.port, [
                                                            {
                                                                type: 'required'
                                                            }
                                                        ]),
                                                        required: true
                                                    }],
                                                })(
                                                    <InputNumber step={1} min={1}
                                                        placeholder={getFormFieldPlaceholder(localePkg.Placehoder.Input, localePkg.Model.Connection.redisConfig.port)}
                                                    />
                                                )}
                                            </Item>
                                        </Card>
                                    );
                                })}
                                <div className="text-center"><Button onClick={() => this.handleAddKey()}>{localePkg.Client.Action.addRedisConfig}</Button></div>
                            </div>
                        ) : null}
                    </Card>
                ) : null}
                <Item className="text-right" {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={formHasErrors(getFieldsError())} loading={loading}>
                        {isCreate ? localePkg.Client.Action.create : localePkg.Client.Action.modify}
                    </Button>
                </Item>
            </Form>
        );
    }
    private handleSubmit = (e: React.FormEvent<any>) => {
        const {onSubmit} = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const result = {...values};
                if (result.type === ConnectionType.REDIS && Array.isArray(result.config)) {
                    result.config = result.config.filter((item) => {
                        return item;
                    });
                }
                delete result.redisKeys;
                if (result.config.length === 1) {
                    result.config = result.config[0];
                }
                onSubmit(filterEmptyFields(result));
            }
        });
    }
    private handleRemoveKey = (key) => {
        const { getFieldValue, setFieldsValue, validateFields } = this.props.form;
        const keyList = getFieldValue('redisKeys');
        const redisKeys = keyList.filter((curKey) => {
            return curKey !== key;
        });
        setFieldsValue({
            redisKeys
        });
        setTimeout(() => {
            validateFields();
        }, 0);
    }
    private handleAddKey = () => {
        const { getFieldValue, setFieldsValue, validateFields } = this.props.form;
        const keyList = getFieldValue('redisKeys');
        const curKey = (keyList[keyList.length - 1] + 1);
        const redisKeys = keyList.concat(curKey);
        setFieldsValue({
            redisKeys
        });
        setTimeout(() => {
            validateFields();
        }, 0);
    }
}

export default Form.create()(ConnectionProfileModifyForm);
