/* eslint-disable no-undef */
'use strict';
const request = require('supertest');
const { User } = require('../../../models/user');
const bcrypt = require('bcryptjs');
describe('/profile-image/', () => {
    let server;

    beforeEach(async () => {
        server = require('../../../index');
    });
    afterEach(async () => {
        await User.remove({});
        server.close();
    });
    beforeAll(() => {});
    describe('GET /', () => {
        it('should render main page (index)', async () => {
            const name = 'testtest';
            const email = 'test@test.comm';
            const password = '123456';

            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password
            });
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .get('/hello/')
                .set('Cookie', ['token=' + token]);

            expect(res.status).toBe(200);
        });
    });
    describe('GET /login', () => {
        it('should render login page', async () => {
            const res = await request(server).get('/hello/login');

            expect(res.status).toBe(200);
        });
    });
    describe('GET /messages', () => {
        it('should render messages page', async () => {
            const name = 'testtest';
            const email = 'test@test.comm';
            const password = '123456';

            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password
            });
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .get('/hello/messages')
                .set('Cookie', ['token=' + token]);

            expect(res.status).toBe(200);
        });
    });
    describe('GET /settings', () => {
        it('should render settings page', async () => {
            const name = 'testtest';
            const email = 'test@test.comm';
            const password = '123456';

            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password
            });
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .get('/hello/settings')
                .set('Cookie', ['token=' + token]);

            expect(res.status).toBe(200);
        });
    });
    describe('GET /video-call', () => {
        it('should render video-call page', async () => {
            const name = 'testtest';
            const email = 'test@test.comm';
            const password = '123456';

            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password
            });
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .get('/hello/video-call')
                .set('Cookie', ['token=' + token]);

            expect(res.status).toBe(200);
        });
    });
    describe('GET /voip', () => {
        it('should render voip page', async () => {
            const name = 'testtest';
            const email = 'test@test.comm';
            const password = '123456';

            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password
            });
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .get('/hello/settings')
                .set('Cookie', ['token=' + token]);

            expect(res.status).toBe(200);
        });
    });
});
