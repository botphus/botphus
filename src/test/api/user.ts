import {Schema} from 'mongoose';
import * as assert from 'power-assert';
import * as request from 'supertest';

import {SystemCode} from '../../server/types/common';
import {IRequestData} from '../interfaces';

import {testAdminEmail, testAdminNickname, testEmail, testEmail2, testNickname, testPwd} from '../const';

import cacheClient, {getRedisKey} from '../../server/modules/cache';
import config from '../../server/modules/config';
import {app, localePkg} from '../../server/modules/util';

const client = request(app.server);

const sessionReg = new RegExp(`^${config.sessionCookieKey}=([^;]*)(;|)[\\S\\s]*$`);

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
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
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
                    assert(res.header['set-cookie'] && res.header['set-cookie'].length === 1);
                    cookieKey = res.header['set-cookie'][0].replace(sessionReg, '$1');
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
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
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
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
                    userId: createUserId
                })
                .expect(200)
                .expect((res: IRequestData) => {
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
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
                    assert(res.header['set-cookie'] && res.header['set-cookie'].length === 1);
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('Get self profile', (done) => {
            client.get('/api/user/profile/my/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
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
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
                    assert(res.body.data);
                    assert(res.body.data._id === createUserId);
                    assert(res.body.data.email === testEmail2);
                    assert(res.body.data.nickname === testNickname);
                })
                .end(done);
        });
        it('Logout', (done) => {
            client.get('/api/user/logout/')
                .set('Cookie', config.sessionCookieKey + '=' + cookieKey)
                .expect(200)
                .expect((res: IRequestData) => {
                    assert(res.header['set-cookie'] && res.header['set-cookie'].length === 1);
                    assert(res.header['set-cookie'][0].replace(sessionReg, '$1') === '');
                    assert(res.body.rid);
                    assert(res.body.code === SystemCode.SUCCESS);
                    assert(res.body.message === localePkg.SystemCode.success);
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
