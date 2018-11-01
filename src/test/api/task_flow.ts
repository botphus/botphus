import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {IRequestData} from '../interfaces';

import {sessionReg, taskFlowExcludeOption, taskFlowName, taskFlowStartPage, testAdminEmail, testPwd} from '../const';

import config from '../../server/modules/config';
import {app} from '../../server/modules/util';
import {assertResMessage} from '../util';

const client = request(app.server);

export default function() {
    describe('Task Flow', () => {
        let cookieKey: string = '';
        let taskId: Schema.Types.ObjectId;
        let taskFlowId: Schema.Types.ObjectId;
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
                            client.get('/api/task/')
                                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                                .expect(200)
                                .expect((res: IRequestData) => {
                                    assertResMessage(res);
                                    assert(res.body.data);
                                    assert(res.body.data.page === 1);
                                    assert(res.body.data.pageSize === 10);
                                    assert(res.body.data.total === 1);
                                    assert(res.body.data.content.length === 1);
                                    taskId = res.body.data.content[0]._id;
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
            client.post('/api/task-flow/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    excludeOption: taskFlowExcludeOption,
                    name: taskFlowName,
                    redisId,
                    startPage: taskFlowStartPage,
                    taskId
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    taskFlowId = res.body.data;
                })
                .end(done);
        });
        it('Get task flow data', (done) => {
            client.get(`/api/task-flow/profile/?id=${taskFlowId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === taskFlowName);
                    assert(res.body.data.redisId === redisId);
                    assert(res.body.data.taskId === taskId);
                    assert(res.body.data.startPage === taskFlowStartPage);
                    assert(res.body.data.taskDetail);
                    assert(res.body.data.taskReportMap);
                    assert(res.body.data.redisDetail);
                    assert(!res.body.data.mysqlDetail);
                })
                .end(done);
        });
        it('Get task list', (done) => {
            client.get('/api/task-flow/')
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
