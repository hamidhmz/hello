const request = require("supertest");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");

describe("/api/users/test", () => {
    let server;
    server = require("../../index");

    // beforeAll(() => {
    // });
    // beforeEach(() => {
    //     // server = require("../../index");
    // });
    // afterAll(async () => {
    //     try {
    //         // await User.remove({});
    //         await server.close();

    //     } catch (error) {
    //         console.log(error);
    //     }
    // });
    // afterEach(async () => {
    //     try {
    //         await User.remove({});
    //         await server.close();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });
    var assert = require('assert');
    describe('Array', function () {
        describe('#indexOf()', function () {
            // it('should return -1 when the value is not present', function () {
            //     assert.equal([1, 2, 3].indexOf(4), 0);
            // });
            it("should return 200 after login", async () => {
                // var mg = require('mongoose');

                // mg.connect('mongodb://localhost/cat_test');

                // var Cat = mg.model('Cat', { name: String });
                // var kitty = new Cat({ name: 'Zildjian' });
                // console.log("1");
                const name = "testtest3";
                const email = "test@test.com";
                const password = "123456";
                const user = new User({
                    "name": name,
                    "email": email,
                    "password": password
                });
                await user.save();
                // request(server).post("/hello/api/users/login").send({ "email": email, "password": password }).expect(400).end(async function (err, res) {
                //     if (err) throw err;
                //     await User.remove({});
                // });
                const result = await request(server).post("/hello/api/users/login");
                await User.remove({});
                // done();

                // bcrypt.genSalt(10, async function (err, salt) {
                //     bcrypt.hash(password, salt, async function (err, hash) {
                //         user.password = hash;
                //         try {
                //             console.log("sssss");
                //             request(server).post("/hello/api/users/login").send({ "email": email, "password": password }).expect(10).end(async function (err, res) {
                //                 if (err) throw err;
                //                 console.log(res);
                //             });
                //             // await User.remove({});

                //         } catch (error) {
                //             expect(error).toMatch("error");
                //         }
                //     });
                // });
            });
        });
    });
    // describe("POST /hello/api/users/login ", () => {
    // it("should return 200 after login", async () => {
    //     console.log("1");
    //     const name = "testtest3";
    //     const email = "test@test.com";
    //     const password = "123456";
    //     const user = new User({
    //         "name": name,
    //         "email": email,
    //         "password": password
    //     });

    //     bcrypt.genSalt(10, async function (err, salt) {
    //         bcrypt.hash(password, salt, async function (err, hash) {
    //             user.password = hash;
    //             try {
    //                 await user.save();
    //                 console.log("sssss");
    //                 request(server).post("/hello/api/users/login").send({ "email": email, "password": password }).expect(10).end(async function (err, res) {
    //                     if (err) throw err;
    //                     console.log(res);
    //                 });
    //                 // await User.remove({});

    //             } catch (error) {
    //                 expect(error).toMatch("error");
    //             }
    //         });
    //     });
    //     // });
    //     // it("should return 400 if email was wrong", async () => {
    //     //     console.log("2");
    //     //     const name = "testtest2";
    //     //     const email = "test@test.com";
    //     //     const password = "123456";
    //     //     const user = new User({
    //     //         "name": name,
    //     //         "email": email,
    //     //         "password": password
    //     //     });

    //     //     bcrypt.genSalt(10, async function (err, salt) {
    //     //         bcrypt.hash(password, salt, async function (err, hash) {
    //     //             user.password = hash;
    //     //             try {
    //     //                 await user.save();
    //     //                 const response = await request(server).post("/hello/api/users/login").send({ "email": "wrongEmail", "password": password });
    //     //                 await User.remove({});
    //     //                 expect(response.statusCode).toBe(400);
    //     //             } catch (error) {
    //     //                 expect(error).toMatch("error");
    //     //             }
    //     //         });
    //     //     });
    //     // });
    //     // it("should return 400 if password was wrong", async () => {
    //     //     console.log("3");
    //     //     const name = "testtest1";
    //     //     const email = "test@test.com";
    //     //     const password = "123456";
    //     //     const user = new User({
    //     //         "name": name,
    //     //         "email": email,
    //     //         "password": password
    //     //     });

    //     //     bcrypt.genSalt(10, async function (err, salt) {
    //     //         bcrypt.hash(password, salt, async function (err, hash) {
    //     //             user.password = hash;
    //     //             try {
    //     //                 await user.save();
    //     //                 const response = await request(server).post("/hello/api/users/login").send({ "email": email, "password": "WrongPass" });
    //     //                 await User.remove();
    //     //                 expect(response.statusCode).toBe(400);
    //     //             } catch (error) {
    //     //                 expect(error).toMatch("error");
    //     //             }
    //     //         });
    //     //     });
    //     // });
    // });
});