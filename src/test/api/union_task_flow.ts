import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {IRequestData} from '../interfaces';

import {sessionReg, taskFlowName, testAdminEmail, testPwd} from '../const';

import config from '../../server/modules/config';
import {app} from '../../server/modules/util';
import {assertResMessage} from '../util';

const client = request(app.server);

export default function() {
    describe('Union Task Flow', () => {
        let cookieKey: string = '';
        let unionTaskId: Schema.Types.ObjectId;
        let unionTaskFlowId: Schema.Types.ObjectId;
        let redisId: Schema.Types.ObjectId;
        before((done) => {
            new Promise((resolve, reject) => {
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
                    .end((err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
            })
                .then(() => {
                    return Promise.all([
                        // Get task ID
                        new Promise((resolve, reject) => {
                            client.get('/api/union-task/')
                                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                                .expect(200)
                                .expect((res: IRequestData) => {
                                    assertResMessage(res);
                                    assert(res.body.data);
                                    assert(res.body.data.page === 1);
                                    assert(res.body.data.pageSize === 10);
                                    assert(res.body.data.total === 1);
                                    assert(res.body.data.content.length === 1);
                                    unionTaskId = res.body.data.content[0]._id;
                                })
                                .end((err) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve();
                                });
                        }),
                        // Get redis ID
                        new Promise((resolve, reject) => {
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
                                    redisId = res.body.data.content[0]._id;
                                })
                                .end((err) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve();
                                });
                        })
                    ]);
                })
                .then(() => done())
                .catch(done);
        });
        it('Create', (done) => {
            client.post('/api/union-task-flow/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    excludeTask: {},
                    name: taskFlowName,
                    redisId,
                    unionTaskId
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    unionTaskFlowId = res.body.data;
                })
                .end(done);
        });
        it('Get task flow data', (done) => {
            client.get(`/api/union-task-flow/profile/?id=${unionTaskFlowId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === taskFlowName);
                    assert(res.body.data.redisId === redisId);
                    assert(res.body.data.unionTaskId === unionTaskId);
                    assert(res.body.data.unionTaskDetail);
                    assert(res.body.data.taskReportMap);
                    assert(res.body.data.redisDetail);
                    assert(!res.body.data.mysqlDetail);
                })
                .end(done);
        });
        it('Get task list', (done) => {
            client.get('/api/union-task-flow/')
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
