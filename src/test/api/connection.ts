import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {ConnectionType} from '../../server/types/connection';
import {IRequestData} from '../interfaces';

import {connectionMysqlConfig, connectionName, connectionRedisClusterConfig, connectionRedisConfig, sessionReg, testAdminEmail, testPwd} from '../const';

import config from '../../server/modules/config';
import {app} from '../../server/modules/util';
import {assertResMessage} from '../util';

const client = request(app.server);

export default function() {
    describe('Connection', () => {
        let cookieKey: string = '';
        let connectionId: Schema.Types.ObjectId;
        before((done) => {
            client.post('/api/user/login/')
                .send({
                    email: testAdminEmail,
                    password: testPwd
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.header['set-cookie'] && res.header['set-cookie'].length === 1);
                    cookieKey = res.header['set-cookie'][0].replace(sessionReg, '$1');
                    assert(res.body.data);
                })
                .end(done);
        });
        it('Create', (done) => {
            client.post('/api/connection/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    config: connectionMysqlConfig,
                    name: connectionName,
                    type: ConnectionType.MYSQL
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    connectionId = res.body.data;
                })
                .end(done);
        });
        it('Get connection data', (done) => {
            client.get(`/api/connection/profile/?id=${connectionId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === connectionName);
                    assert(res.body.data.type === ConnectionType.MYSQL);
                    assert(res.body.data.config.database === connectionMysqlConfig.database);
                    assert(res.body.data.config.host === connectionMysqlConfig.host);
                    assert(res.body.data.config.password === connectionMysqlConfig.password);
                    assert(res.body.data.config.user === connectionMysqlConfig.user);
                })
                .end(done);
        });
        it('Modify data to redis config', (done) => {
            client.patch('/api/connection/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    config: connectionRedisConfig,
                    modifyId: connectionId,
                    name: connectionName,
                    type: ConnectionType.REDIS,
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get connection data', (done) => {
            client.get(`/api/connection/profile/?id=${connectionId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === connectionName);
                    assert(res.body.data.type === ConnectionType.REDIS);
                    assert(res.body.data.config.host === connectionRedisConfig.host);
                    assert(res.body.data.config.port === connectionRedisConfig.port);
                })
                .end(done);
        });
        it('Modify data to redis cluster config', (done) => {
            client.patch('/api/connection/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    config: connectionRedisClusterConfig,
                    modifyId: connectionId,
                    name: connectionName,
                    type: ConnectionType.REDIS,
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get connection data', (done) => {
            client.get(`/api/connection/profile/?id=${connectionId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === connectionName);
                    assert(res.body.data.type === ConnectionType.REDIS);
                    assert(res.body.data.config.length === connectionRedisClusterConfig.length);
                    assert(connectionRedisClusterConfig.every((item, index) => {
                        return item.host === res.body.data.config[index].host && item.port === res.body.data.config[index].port;
                    }));
                })
                .end(done);
        });
        it('Get connection list', (done) => {
            client.get('/api/connection/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.page === 1);
                    assert(res.body.data.pageSize === 10);
                    assert(res.body.data.total === 1);
                    assert(res.body.data.content.length === 1);
                })
                .end(done);
        });
    });
}
