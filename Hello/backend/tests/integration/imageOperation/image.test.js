/* eslint-disable no-undef */
'use strict';
const request = require('supertest');
const fs = require('mz/fs');
const path = require('path');
const { User } = require('../../../models/user');
const bcrypt = require('bcryptjs');
const { base64EncodeFile } = require('../../../lib/files');
const filePath_ = path.join(__dirname + '/test.jpg');
let testFilePath = null;
describe('/profile-image/', () => {
    let server;

    beforeEach(async () => {
        server = require('../../../index');
    });
    afterEach(async () => {
        try {
            await server.close();
            await User.remove({});
            if (testFilePath !== null) {
                await fs.unlink(testFilePath);
            }
        } catch (error) {
            console.log(error);
        }
    });
    beforeAll(() => {});
    describe('GET /profile-image/', () => {
        it('should return image file for owner user ', async () => {
            const name = 'testtest';
            const email = 'test@test.comm';
            const password = '123456';

            const profileImage = path.join(
                __dirname + '/../../../uploads/test.jpg'
            );
            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password,
                profileImage: profileImage
            });
            await fs.writeFile(profileImage, './test.jpg');
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .get('/hello/profile-image/')
                .set('Cookie', ['token=' + token]);

            expect(base64EncodeFile(profileImage)).toBe(res.text);
            testFilePath = profileImage;
        });
    });
    describe('GET /profile-image/:email', () => {
        it('should return image file for specific user', async () => {
            const name = 'testtest';
            const email = 'test@test.com';
            const password = '123456';

            const profileImage = path.join(
                __dirname + '/../../../uploads/test.jpg'
            );
            const user = new User({
                name: name,
                email: email,
                password: password,
                passwordReveal: password,
                profileImage: profileImage
            });
            await fs.writeFile(profileImage, './test.jpg');
            const mainFile = await fs.readFile(profileImage);
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const token = user.generateAuthToken();
            const res = await request(server)
                .get('/hello/profile-image/' + email)
                .set('Cookie', ['token=' + token]);
            expect(res.body.equals(mainFile)).toBe(true);
            testFilePath = profileImage;
        });
    });
    describe('POST /profile-image upload a new image', () => {
        // Upload first test file to CDN
        it('should upload the test file to server', async () => {
            // Test if the test file is exist
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
            const res = await request(server)
                .post('/hello/upload')
                .set('Cookie', ['token=' + token])
                // Attach the file with key 'file'
                //which is corresponding to your endpoint setting.
                .attach('filepond', filePath_);

            expect(res.status).toBe(200);
            expect(res.text).toBe('File uploaded!');
            // console.log(res);

            // store file data for following tests
            const thisUser = await User.find({ email: 'test@test.com' }).select(
                {
                    profileImage: 1
                }
            );
            const fileExists = await fs.exists(thisUser[0].profileImage);
            expect(fileExists).toBe(true);
            testFilePath = thisUser[0].profileImage;
        });
    });
});
