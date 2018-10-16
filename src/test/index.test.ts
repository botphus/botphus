import * as request from 'supertest';

import {clientType} from './types';

import createApp from '../server/app';
import mongoose from '../server/models/';
import cacheClient from '../server/modules/cache';
import {app} from '../server/modules/util';

import apiTest from './api/';
import clearData from './clear_data';

describe('Botphus', () => {
    let client: clientType;
    before('Create App', (done) => {
        createApp()
            .then(() => {
                return app.ready();
            })
            .then(() => {
                client = request(app.server);
                return done();
            })
            .catch(done);
    });
    describe('Common', () => {
        it('GET 404 Page', (done) => {
            client.get('/404/')
            .expect(404)
            .end(done);
        });
    });
    apiTest();
    clearData();
    after('Close database connection', (done) => {
        Promise.all([mongoose.disconnect(), cacheClient.quit()])
            .then(() => {
                done();
            });
    });
});
