import {Card, Col, Row} from 'antd';
import * as React from 'react';

import {ITaskFlowDetailItem} from '../../interfaces/task';

import {localePkg} from '../../lib/const';

interface ITaskFlowInfoProps {
    detail: ITaskFlowDetailItem;
}

export default class TaskFlowInfo extends React.Component<ITaskFlowInfoProps> {
    public render() {
        const {detail} = this.props;
        return (
            <div className="app-task-flow-info">
                <Row>
                    <Col span={8}>
                        <span>{localePkg.Model.TaskFlow.name}:{detail.name}</span>
                    </Col>
                    <Col span={8}>
                        <span>{localePkg.Model.Common.createdAt}:{detail.createdAt}</span>
                    </Col>
                    <Col span={8}>
                        <span>{localePkg.Model.TaskFlow.startPage}:{detail.startPage}</span>
                    </Col>
                </Row>
                {detail.redisId || detail.mysqlId ? (
                    <Card title={localePkg.Client.Title.TaskFlowConnection} className="m-t">
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
                ) : null}
            </div>
        );
    }
}
