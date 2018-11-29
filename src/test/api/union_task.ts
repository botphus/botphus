import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {IRequestData} from '../interfaces';

import {sessionReg, testAdminEmail, testAdminNickname, testEmail2, testNickname, testPwd, unionTaskName} from '../const';

import config from '../../server/modules/config';
import {app} from '../../server/modules/util';
import {assertResMessage} from '../util';

const client = request(app.server);

export default function() {
    describe('Union Task', () => {
        let cookieKey: string = '';
        let taskId: Schema.Types.ObjectId;
        let taskName: string = '';
        let memeberUserId: Schema.Types.ObjectId;
        let unionTaskId: Schema.Types.ObjectId;
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
                    return new Promise((resolve, reject) => {
                        client.get(`/api/user/?email=${testEmail2}`)
                            .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                            .expect(200)
                            .expect((res: IRequestData) => {
                                assertResMessage(res);
                                assert(res.body.data);
                                assert(res.body.data.content.length === 1);
                                memeberUserId = res.body.data.content[0]._id;
                            })
                            .end((err) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve();
                            });
                    });
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        client.get('/api/task/')
                            .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                            .expect(200)
                            .expect((res: IRequestData) => {
                                assertResMessage(res);
                                assert(res.body.data);
                                assert(res.body.data.content.length === 1);
                                taskId = res.body.data.content[0]._id;
                                taskName = res.body.data.content[0].name;
                            })
                            .end((err) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve();
                            });
                    });
                })
                .then(() => done())
                .catch(done);
        });
        it('Create', (done) => {
            client.post('/api/union-task/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    name: unionTaskName,
                    taskItems: [
                        {
                            ignoreError: false,
                            name: taskName,
                            taskId,
                        }
                    ]
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    unionTaskId = res.body.data;
                })
                .end(done);
        });
        it('Get union task data', (done) => {
            client.get(`/api/union-task/profile/?id=${unionTaskId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === unionTaskName);
                    assert(res.body.data.taskItems.length === 1);
                    assert(res.body.data.members.length === 0);
                    assert(res.body.data.createdUserName === testAdminNickname);
                })
                .end(done);
        });
        it('Modify data', (done) => {
            client.patch('/api/union-task/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    members: [memeberUserId],
                    modifyId: unionTaskId,
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get union task data', (done) => {
            client.get(`/api/union-task/profile/?id=${unionTaskId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === unionTaskName);
                    assert(res.body.data.taskItems.length === 1);
                    assert(res.body.data.members.length === 1);
                    assert(res.body.data.members[0].nickname === testNickname);
                    assert(res.body.data.createdUserName === testAdminNickname);
                })
                .end(done);
        });
        it('Get union task list', (done) => {
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
                })
                .end(done);
        });
    });
}
