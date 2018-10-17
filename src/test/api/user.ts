import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {IRequestData} from '../interfaces';

import {sessionReg, testAdminEmail, testAdminNickname, testEmail, testEmail2, testNickname, testPwd} from '../const';

import cacheClient, {getRedisKey} from '../../server/modules/cache';
import config from '../../server/modules/config';
import {app} from '../../server/modules/util';
import {assertResMessage} from '../util';

const client = request(app.server);

export default function() {
    let cookieKey: string = '';
    let adminUserId: Schema.Types.ObjectId;
    let createUserId: Schema.Types.ObjectId;
    describe('User', () => {
        it('Install', (done) => {
            client.post('/api/user/install/')
                .send({
                    email: testAdminEmail,
                    nickname: testAdminNickname,
                    password: testPwd
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    adminUserId = res.body.data;
                })
                .end(done);
        });
        it('Login', (done) => {
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
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Check login session', (done) => {
            cacheClient.get(getRedisKey(cookieKey))
                .then((session) => {
                    assert(session);
                    done();
                })
                .catch(done);
        });
        it('Create', (done) => {
            client.post('/api/user/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    email: testEmail,
                    nickname: testNickname,
                    password: testPwd
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    createUserId = res.body.data;
                })
                .end(done);
        });
        it('Update user', (done) => {
            client.patch('/api/user/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .send({
                    email: testEmail2,
                    modifyId: createUserId
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Login with new email', (done) => {
            client.post('/api/user/login/')
                .send({
                    email: testEmail2,
                    password: testPwd
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.header['set-cookie'] && res.header['set-cookie'].length === 1);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get self profile', (done) => {
            client.get('/api/user/profile/my/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data._id === adminUserId);
                    assert(res.body.data.email === testAdminEmail);
                    assert(res.body.data.nickname === testAdminNickname);
                })
                .end(done);
        });
        it('Get user profile', (done) => {
            client.get(`/api/user/profile/?id=${createUserId}`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data._id === createUserId);
                    assert(res.body.data.email === testEmail2);
                    assert(res.body.data.nickname === testNickname);
                })
                .end(done);
        });
        it('Get user list', (done) => {
            client.get(`/api/user/`)
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.body.data);
                    assert(res.body.data.page === 1);
                    assert(res.body.data.pageSize === 10);
                    assert(res.body.data.total === 2);
                    assert(res.body.data.content.length === 2);
                })
                .end(done);
        });
        it('Logout', (done) => {
            client.get('/api/user/logout/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assertResMessage(res);
                    assert(res.header['set-cookie'] && res.header['set-cookie'].length === 1);
                    assert(res.header['set-cookie'][0].replace(sessionReg, '$1') === '');
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Check logout session', (done) => {
            cacheClient.get(getRedisKey(cookieKey))
                .then((session) => {
                    assert(!session);
                    done();
                })
                .catch(done);
        });
    });
}
