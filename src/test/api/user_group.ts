import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {IRequestData} from '../interfaces';

import {sessionReg, testAdminEmail, testEmail2, testNickname, testPwd, userGroupName} from '../const';

import config from '../../server/modules/config';
import {app} from '../../server/modules/util';
import {assertResMessage} from '../util';

const client = request(app.server);

export default function() {
    describe('User Group', () => {
        let cookieKey: string = '';
        let groupId: Schema.Types.ObjectId;
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
            client.post('/api/user-group/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    members: [],
                    name: userGroupName,
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    groupId = res.body.data;
                })
                .end(done);
        });
        it('Get group data', (done) => {
            client.get(`/api/user-group/profile/?id=${groupId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === userGroupName);
                    assert(res.body.data.members.length === 0);
                })
                .end(done);
        });
        it('Modify data', (done) => {
            client.patch('/api/user-group/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    members: [memeberUserId],
                    modifyId: groupId,
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get user group data', (done) => {
            client.get(`/api/user-group/profile/?id=${groupId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.name === userGroupName);
                    assert(res.body.data.members.length === 1);
                    assert(res.body.data.members[0].nickname === testNickname);
                })
                .end(done);
        });
        it('Get task list', (done) => {
            client.get('/api/user-group/')
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
