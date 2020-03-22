/* eslint-disable */
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { User } = require('../../../models/user');
const { ContactUs } = require('../../../models/ContactUs');
// const expect = require("chai").expect;

describe('/hello/api/users/test', () => {
    let server;
    beforeAll((done) => {
        done();
    });
    beforeEach(async () => {
        server = require('../../../index');
        await User.remove({});
    });
    afterEach(async () => {
        try {
            await User.remove({});
            await ContactUs.remove({});
            await server.close();
        } catch (error) {
            console.log(error);
        }
    });
    afterAll((done) => {
        done();
    });
    describe('GET /hello/api/users/list ', () => {
        /* ------------------------------- happy path ------------------------------- */
        it('should return count of three document of users collection ', async () => {
            let lastUser;
            let passwordArray = [];
            for (let index = 0; index < 3; index++) {
                const name = 'testtest' + index;
                const email = 'test@test.com' + index;
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
                passwordArray[index] = hash;
                await user.save();
                if (index == 2) {
                    lastUser = user.generateAuthToken();
                }
            }
            const result = await request(server)
                .get('/hello/api/users/list')
                .set({ 'x-auth-token': lastUser });
            expect(result.status).toBe(200);
            expect(result.body.length).toBe(3);
            expect(result.body[0].name).toBe('testtest0');
            expect(result.body[0].email).toBe('test@test.com0');
            expect(result.body[0].password).toBe(passwordArray[0]);

            expect(result.body[1].name).toBe('testtest1');
            expect(result.body[1].email).toBe('test@test.com1');
            expect(result.body[1].password).toBe(passwordArray[1]);

            expect(result.body[2].name).toBe('testtest2');
            expect(result.body[2].email).toBe('test@test.com2');
            expect(result.body[2].password).toBe(passwordArray[2]);
        });
        it('should return 400 status code if user use wrong token ', async () => {
            for (let index = 0; index < 3; index++) {
                const name = 'testtest' + index;
                const email = 'test@test.com' + index;
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
            }
            const result = await request(server)
                .get('/hello/api/users/list')
                .set({ 'x-auth-token': 'wrong token' });

            expect(result.status).toBe(400);
            expect(result.text).toBe('invalid token.');
        });
        it("should return 401 status code if doesn't have any token  ", async () => {
            for (let index = 0; index < 3; index++) {
                const name = 'testtest' + index;
                const email = 'test@test.com' + index;
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
            }
            const result1 = await request(server)
                .get('/hello/api/users/list')
                .set({ 'x-auth-token': '' });
            expect(result1.status).toBe(401);
            const result2 = await request(server).get('/hello/api/users/list');
            expect(result2.status).toBe(401);
        });
    });
    describe('GET /hello/api/users/me', () => {
        /* ------------------------------- happy path ------------------------------- */
        it('should return correct user document ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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

            const result = await request(server)
                .get('/hello/api/users/me')
                .set({ 'x-auth-token': token });
            expect(result.status).toBe(200);
            expect(result.body.name).toBe(user.name);
            expect(result.body.email).toBe(user.email);
        });
        it("should return 401 status for doesn't any token", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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

            const result = await request(server)
                .get('/hello/api/users/me')
                .set({ 'x-auth-token': '' });
            expect(result.status).toBe(401);
            const result1 = await request(server)
                .get('/hello/api/users/me')
                .set({ 'x-auth-token': ' ' });
            expect(result1.status).toBe(401);
            const result2 = await request(server).get('/hello/api/users/me');
            expect(result2.status).toBe(401);
        });
        it('should return 400 status for wrong token ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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

            const result2 = await request(server)
                .get('/hello/api/users/me')
                .set({ 'x-auth-token': 'wrong token' });
            expect(result2.status).toBe(400);
        });
    });

    describe('POST /hello/api/users/register ', () => {
        /* ------------------------------- happy path ------------------------------- */
        it('should return 200 after register and return user', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });
            expect(result.status).toBe(200);
            expect(result.body.name).toBe(name);
            expect(result.body.email).toBe(email);
        });
        it('should return error with 400 status code if name was little than 5 characters ', async () => {
            const name = 'test';
            const email = 'test@test.com';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"name" length must be at least 5 characters long'
            );
        });
        it('should return error with 400 status code if name was more than 50 characters ', async () => {
            const name = '123456789112345678911234567891123456789112345678912';
            const email = 'test@test.com';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"name" length must be less than or equal to 50 characters long'
            );
        });
        it("should return error with 400 status code if name doesn't exists ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe('"name" is required');
        });
        it("should return error with 400 status code if email wasn't valid ", async () => {
            const name = 'testtest';
            const email = 'testtest.com';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe('"email" must be a valid email');
        });
        it('should return error with 400 status code if email was more than 50 characters ', async () => {
            const name = 'testtest';
            const email =
                'test@test.123456789112345678911234567891123456789112345678912';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"email" length must be less than or equal to 50 characters long'
            );
        });
        it("should return error with 400 status code if email doesn't exists ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe('"email" is required');
        });
        it('should return error with 400 status code if email was duplicate ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '123456';

            await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });
            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe('User already registered.');
        });
        it('should return error with 400 status code if password was little than 5 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '1234';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"password" length must be at least 5 characters long'
            );
        });
        it('should return error with 400 status code if password was more than 50 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password =
                '123456789112345678911234567891123456789112345678912';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email, password: password });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"password" length must be less than or equal to 50 characters long'
            );
        });
        it("should return error with 400 status code if password doesn't exists ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '123456';

            const result = await request(server)
                .post('/hello/api/users/register')
                .send({ name: name, email: email });

            expect(result.status).toBe(400);
            expect(result.text).toBe('"password" is required');
        });
        it('should return 400 if email was wrong', async () => {
            const name = 'testtest2';
            const email = 'test@test.com';
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
            const result = await request(server)
                .post('/hello/api/users/login')
                .send({ email: 'wrongEmail', password: password });
            await User.remove({});
            expect(result.status).toBe(400);
        });
        it('should return 400 if password was wrong', async () => {
            const name = 'testtest1';
            const email = 'test@test.com';
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
            const result = await request(server)
                .post('/hello/api/users/login')
                .send({ email: email, password: 'WrongPass' });

            expect(result.status).toBe(400);
        });
    });
    describe('POST /hello/api/users/edit-name-or-email', () => {
        /* ------------------------------- happy path ------------------------------- */
        it('should change email and name', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = 'testtest2';
            const email2 = 'test@test.com2';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ name: name2, email: email2 });
            const editedUser = await User.findOne({ email: email2 });

            expect(result.status).toBe(200);
            expect(editedUser.name).toBe(name2);
            expect(editedUser.email).toBe(email2);
        });
        it("should return error with 400 status code if name doesn't exists ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = 'testtest2';
            const email2 = 'test@test.com2';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ email: email2 });
            const editedUser = await User.findOne({ email: email2 });
            expect(result.status).toBe(400);
            expect(result.text).toBe('"name" is required');
        });
        it('should return error with 400 status code if name was little than 5 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = 'test';
            const email2 = 'test@test.com2';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ name: name2, email: email2 });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"name" length must be at least 5 characters long'
            );
        });
        it('should return error with 400 status code if name was more than 50 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = '123456789112345678911234567891123456789112345678912';
            const email2 = 'test@test.com2';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ name: name2, email: email2 });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"name" length must be less than or equal to 50 characters long'
            );
        });
        it("should return error with 400 status code if email doesn't exists ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = 'test';
            const email2 = 'test@test.com2';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ name: name2 });

            expect(result.status).toBe(400);
            expect(result.text).toBe('"email" is required');
        });
        it('should return 400 token was invalid ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = 'testtest2';
            const email2 = 'test@test.com2';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': 'wrong token' })
                .send({ name: name2, email: email2 });
            const editedUser = await User.findOne({ email: email2 });

            expect(result.status).toBe(400);
            expect(result.text).toBe('invalid token.');
        });
        it('should return error with 400 status code if email was duplicate ', async () => {
            // first user
            const name = 'testtest';
            const email = 'test@test.com';
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
            // the second user
            const name2 = 'testtest1';
            const email2 = 'test@test.com1';
            const password2 = '123456';
            const user2 = new User({
                name: name2,
                email: email2,
                password: password2,
                passwordReveal: password2
            });

            const salt2 = bcrypt.genSaltSync(10);
            const hash2 = bcrypt.hashSync(password2, salt2);
            user.password2 = hash2;
            await user2.save();
            const token = user2.generateAuthToken();
            const editedName = 'testtest2';
            const editedEmail = 'test@test.com';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ name: editedName, email: editedEmail });
            const editedUser = await User.findOne({ email: editedEmail });

            expect(result.status).toBe(400);
            expect(result.text).toBe('duplicate email.');
        });
        it("should return error with 400 status code if email wasn't valid ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = 'testtest2';
            const email2 = 'test';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ name: name2, email: email2 });
            const editedUser = await User.findOne({ email: email2 });

            expect(result.status).toBe(400);
            expect(result.text).toBe('"email" must be a valid email');
        });
        it('should return error with 400 status code if email was more than 50 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const name2 = 'testtest2';
            const email2 =
                'test@test.123456789112345678911234567891123456789112345678912';
            const result = await request(server)
                .post('/hello/api/users/edit-name-or-email')
                .set({ 'x-auth-token': token })
                .send({ name: name2, email: email2 });
            const editedUser = await User.findOne({ email: email2 });

            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"email" length must be less than or equal to 50 characters long'
            );
        });
    });

    describe('PUT /hello/api/users/edit-password', () => {
        /* ------------------------------- happy path ------------------------------- */
        it('should return 200 after change password', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const newPassSalt = bcrypt.genSaltSync(10);
            const newPassHash = bcrypt.hashSync(newPassword, newPassSalt);
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            const editedUser = await User.findOne({ email: email });
            const result2 = await request(server)
                .post('/hello/api/users/login')
                .send({ email: email, password: newPassword });
            expect(result.status).toBe(200);
            expect(result2.status).toBe(200);
        });
        it("should return 400 status if oldPassword doesn't exist", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const newPassSalt = bcrypt.genSaltSync(10);
            const newPassHash = bcrypt.hashSync(newPassword, newPassSalt);
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe('"oldPassword" is required');
        });
        it("should return 400 status if newPassword doesn't exist", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const newPassSalt = bcrypt.genSaltSync(10);
            const newPassHash = bcrypt.hashSync(newPassword, newPassSalt);
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe('"newPassword" is required');
        });
        it("should return 400 status if confirmPassword doesn't exist", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const newPassSalt = bcrypt.genSaltSync(10);
            const newPassHash = bcrypt.hashSync(newPassword, newPassSalt);
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe('"newPassword" is required');
        });
        it('should return 400 status if token was invalid', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': 'wrong token' })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe('invalid token.');
        });
        it('should return 400 status if your old password was wrong ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: 'wrong password',
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe('Your Previous Password did not Match.');
        });
        it("should return 400 status if new password and confirm password didn't match ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: 'wrong password'
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe(
                'Your new Password And Confirm did not Match.'
            );
        });
        it('should return error with 400 status code if oldPassword was little than 5 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '1234';
            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password
            });

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            user.passwordReveal = hash;
            await user.save();
            const token = user.generateAuthToken();
            const oldPassword = '1234';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"oldPassword" length must be at least 5 characters long'
            );
        });
        it('should return error with 400 status code if newPassword was little than 5 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '1231';
            const confirmPassword = '123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"newPassword" length must be at least 5 characters long'
            );
        });
        it('should return error with 400 status code if confirmPassword was little than 5 characters ', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword = '1231';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"confirmPassword" length must be at least 5 characters long'
            );
        });
        it('should return error with 400 status code if oldPassword was more than 50 characters', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword =
                '123456123456123456123456123456123456123456123456123456123456123456123456123456123456';
            const newPassword = '123123';
            const confirmPassword = '123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"oldPassword" length must be less than or equal to 50 characters long'
            );
        });
        it('should return error with 400 status code if newPassword was more than 50 characters', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword =
                '123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123';
            const confirmPassword = '123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"newPassword" length must be less than or equal to 50 characters long'
            );
        });
        it('should return error with 400 status code if confirmPassword was more than 50 characters', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
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
            const oldPassword = '123456';
            const newPassword = '123123';
            const confirmPassword =
                '123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123';
            const result = await request(server)
                .put('/hello/api/users/edit-password')
                .set({ 'x-auth-token': token })
                .send({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                });
            expect(result.status).toBe(400);
            expect(result.text).toBe(
                '"confirmPassword" length must be less than or equal to 50 characters long'
            );
        });
    });

    describe('POST /hello/api/users/contact-form', () => {
        /* ------------------------------- happy path ------------------------------- */
        it('should return 200 status code if every thing is okay', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const subject = 'test subject';
            const message = 'test message test message';
            const result = await request(server)
                .post('/hello/api/users/contact-form')
                .set({ 'x-forwarded-for': '192.168.1.1' })
                .send({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                });
            const messageObj = await ContactUs.findOne();

            expect(result.status).toBe(200);
            expect(messageObj.name).toBe(name);
            expect(messageObj.email).toBe(email);
            expect(messageObj.subject).toBe(subject);
            expect(messageObj.message).toBe(message);
        });
        it("should return 400 status code if name doesn't exist", async () => {
            const name = 'test';
            const email = 'test@test.com';
            const subject = 'test subject';
            const message = 'test message test message';
            const result = await request(server)
                .post('/hello/api/users/contact-form')
                .set({ 'x-forwarded-for': '192.168.1.1' })
                .send({
                    email: email,
                    subject: subject,
                    message: message
                });

            expect(result.status).toBe(400);
        });
        it("should return 400 status code if email doesn't exist", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const subject = 'test subject';
            const message = 'test message test message';
            const result = await request(server)
                .post('/hello/api/users/contact-form')
                .set({ 'x-forwarded-for': '192.168.1.1' })
                .send({
                    name: name,
                    subject: subject,
                    message: message
                });

            expect(result.status).toBe(400);
        });
        it("should return 400 status code if subject doesn't exist ", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const subject = 'test subject';
            const message = 'test message test message';
            const result = await request(server)
                .post('/hello/api/users/contact-form')
                .set({ 'x-forwarded-for': '192.168.1.1' })
                .send({
                    name: name,
                    email: email,
                    message: message
                });

            expect(result.status).toBe(400);
        });
        it("should return 400 status code if message doesn't exist", async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const subject = 'test subject';
            const message = 'test message test message';
            const result = await request(server)
                .post('/hello/api/users/contact-form')
                .set({ 'x-forwarded-for': '192.168.1.1' })
                .send({
                    name: name,
                    email: email,
                    subject: subject
                });

            expect(result.status).toBe(400);
        });
    });

    describe('POST /hello/api/users/login ', () => {
        it('should return 200 after login', async () => {
            const name = 'testtest3';
            const email = 'test@test.com';
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
            const result = await request(server)
                .post('/hello/api/users/login')
                .send({ email: email, password: password });
            expect(result.status).toBe(200);
        });
        it('should return 400 if email was wrong', async () => {
            const name = 'testtest2';
            const email = 'test@test.com';
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
            const result = await request(server)
                .post('/hello/api/users/login')
                .send({ email: 'wrongEmail', password: password });
            await User.remove({});
            expect(result.status).toBe(400);
        });
        it('should return 400 if password was wrong', async () => {
            const name = 'testtest1';
            const email = 'test@test.com';
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
            const result = await request(server)
                .post('/hello/api/users/login')
                .send({ email: email, password: 'WrongPass' });

            expect(result.status).toBe(400);
        });
    });
});
