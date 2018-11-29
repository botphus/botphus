import {Alert, Card, Col, Row} from 'antd';
import * as React from 'react';

import {ITaskFlowDetailItem, IUnionTaskFlowDetailItem} from '../../interfaces/task';

import {localePkg} from '../../lib/const';
import {getFormFieldPlaceholder} from '../../lib/form';

interface ITaskFlowConnectionProps {
    detail: ITaskFlowDetailItem | IUnionTaskFlowDetailItem;
}

export default class TaskFlowConnectionInfo extends React.Component<ITaskFlowConnectionProps> {
    public render() {
        const {detail} = this.props;
        if (!(detail.redisId || detail.mysqlId)) {
            return (
                <Card title={localePkg.Client.Title.Connection} className="m-t">
                    <Alert message={getFormFieldPlaceholder(localePkg.Placehoder.Empty, localePkg.Client.Title.Connection)} />
                </Card>
            );
        }
        return (
            <div className="m-t">
                <Card title={localePkg.Client.Title.Connection} className="m-b">
                    {detail.mysqlDetail ? (
                        <Card className="m-b" title={`${localePkg.Client.Title.ConnectionMysqlConfig}:${detail.mysqlDetail.name}`}>
                            <Row className="m-b">
                                <Col span={8}>
                                    <span>{localePkg.Model.Connection.mysqlConfig.database}:{detail.mysqlDetail.config ? detail.mysqlDetail.config.database : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <span>{localePkg.Model.Connection.mysqlConfig.host}:{detail.mysqlDetail.config ? detail.mysqlDetail.config.host : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <span>{localePkg.Model.Connection.mysqlConfig.port}:{detail.mysqlDetail.config ? detail.mysqlDetail.config.port : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <span>{localePkg.Model.Connection.mysqlConfig.user}:{detail.mysqlDetail.config ? detail.mysqlDetail.config.user : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <span>{localePkg.Model.Connection.mysqlConfig.password}:{detail.mysqlDetail.config ? detail.mysqlDetail.config.password : ''}</span>
                                </Col>
                            </Row>
                        </Card>
                    ) : null}
                    {detail.redisDetail && detail.redisDetail.config ? (
                        <Card title={`${localePkg.Client.Title.ConnectionRedisConfig}:${detail.redisDetail.name}`}>
                            {Array.isArray(detail.redisDetail.config) ? (
                                <div>
                                    {detail.redisDetail.config.map((item, index) => {
                                        return (
                                            <Card title={`${localePkg.Client.Title.ConnectionRedisClusterConfig}${index + 1}`} key={index.toString()}>
                                                <Col span={8}>
                                                    <span>{localePkg.Model.Connection.redisConfig.host}:{item.host}</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span>{localePkg.Model.Connection.redisConfig.port}:{item.port}</span>
                                                </Col>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    <Col span={8}>
                                        <span>{localePkg.Model.Connection.redisConfig.host}:{detail.redisDetail.config ? detail.redisDetail.config.host : ''}</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>{localePkg.Model.Connection.redisConfig.host}:{detail.redisDetail.config ? detail.redisDetail.config.port : ''}</span>
                                    </Col>
                                </div>
                            )}
                        </Card>
                    ) : null}
                </Card>
            </div>
        );
    }
}
