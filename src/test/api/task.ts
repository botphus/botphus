import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {TaskPageType} from '../../server/types/task';
import {IRequestData} from '../interfaces';

import {sessionReg, taskName, taskRuleList, testAdminEmail, testAdminNickname, testEmail2, testNickname, testPwd} from '../const';

import config from '../../server/modules/config';
import {app} from '../../server/modules/util';
import {assertResMessage} from '../util';

const client = request(app.server);

export default function() {
    describe('Task', () => {
        let cookieKey: string = '';
        let taskId: Schema.Types.ObjectId;
        let memeberUserId: Schema.Types.ObjectId;
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
                .then(() => done())
                .catch(done);
        });
        it('Create', (done) => {
            client.post('/api/task/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    name: taskName,
                    pageType: TaskPageType.NORMAL,
                    ruleItems: taskRuleList
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    taskId = res.body.data;
                })
                .end(done);
        });
        it('Get task data', (done) => {
            client.get(`/api/task/profile/?id=${taskId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === taskName);
                    assert(res.body.data.ruleItems.length === taskRuleList.length);
                    assert(res.body.data.members.length === 0);
                    assert(res.body.data.createdUserName === testAdminNickname);
                    assert(res.body.data.pageType === TaskPageType.NORMAL);
                })
                .end(done);
        });
        it('Modify data', (done) => {
            client.patch('/api/task/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    members: [memeberUserId],
                    modifyId: taskId,
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get task data', (done) => {
            client.get(`/api/task/profile/?id=${taskId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === taskName);
                    assert(res.body.data.ruleItems.length === taskRuleList.length);
                    assert(res.body.data.members.length === 1);
                    assert(res.body.data.members[0].nickname === testNickname);
                    assert(res.body.data.createdUserName === testAdminNickname);
                    assert(res.body.data.pageType === TaskPageType.NORMAL);
                })
                .end(done);
        });
        it('Get task list', (done) => {
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
                })
                .end(done);
        });
        it('Remove data', (done) => {
            client.delete('/api/task/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    id: taskId,
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get task list', (done) => {
            client.get('/api/task/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.page === 1);
                    assert(res.body.data.pageSize === 10);
                    assert(res.body.data.total === 0);
                    assert(res.body.data.content.length === 0);
                })
                .end(done);
        });
        it('Create again', (done) => {
            client.post('/api/task/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    name: taskName + ' test',
                    pageType: TaskPageType.NORMAL,
                    ruleItems: taskRuleList
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    taskId = res.body.data;
                })
                .end(done);
        });
    });
}
