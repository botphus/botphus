import * as assert from 'power-assert';
import * as request from 'supertest';

import {SystemCode} from '../../server/types/common';
import {IRequestData} from '../interfaces';

import {testAdminEmail, testAdminNickname, testEmail, testNickname, testPwd} from '../const';

import cacheClient, {getRedisKey} from '../../server/modules/cache';
import config from '../../server/modules/config';
import {app, localePkg} from '../../server/modules/util';

const client = request(app.server);

const sessionReg = new RegExp(`^${config.sessionCookieKey}=([^;]*)(;|)[\\S\\s]*$`);

export default function() {
    let cookieKey: string = '';
    describe('User#/api/user/', () => {
        it('/admin/', (done) => {
            client.post('/api/user/admin/')
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
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('/login/', (done) => {
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
        it('/create/', (done) => {
            client.post('/api/user/create/')
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
                    assert(!res.body.data);
                })
                .end(done);
        });
        it('/logout/', (done) => {
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
