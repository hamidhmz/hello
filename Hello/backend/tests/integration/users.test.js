const request = require("supertest");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");
// const expect = require("chai").expect;

describe("/api/users/test", () => {
    let server;

    // beforeAll(() => {
    //     server = require("../../index");
    // });
    beforeEach(() => {
        server = require("../../index");
    });
    // afterAll(async () => {
    //     try {
    //         // await User.remove({});
    //         await server.close();

    //     } catch (error) {
    //         console.log(error);
    //     }
    // });
    afterEach(async () => {
        try {
            await User.remove({});
            await server.close();
        } catch (error) {
            console.log(error);
        }
    });
    // describe("Array", function () {
    //     describe("#indexOf()", function () {
    //         // it("should return -1 when the value is not present", function () {
    //         //     assert.equal([1, 2, 3].indexOf(4), 0);
    //         // });
    //         it("should return 200 after login", async () => {
    //             // var mg = require("mongoose");

    //             // mg.connect('mongodb://localhost/cat_test');

    //             // var Cat = mg.model('Cat', { name: String });
    //             // var kitty = new Cat({ name: 'Zildjian' });
    //             // console.log("1");
    //             const name = "testtest3";
    //             const email = "test@test.com";
    //             const password = "123456";
    //             const user = new User({
    //                 "name": name,
    //                 "email": email,
    //                 "password": password
    //             });
    //             // request(server).post("/hello/api/users/login").send({ "email": email, "password": password }).expect(400).end(async function (err, res) {
    //             //     if (err) throw err;
    //             //     await User.remove({});
    //             // });
    //             // done();

    //             const salt = bcrypt.genSaltSync(10);
    //             const hash = bcrypt.hashSync(password, salt);
    //             user.password = hash;
    //             await user.save();
    //             const result = await request(server).post("/hello/api/users/login").send({ "email": email, "password": password });
    //             await User.remove({});
    //             expect(result.status).to.equal(200);
    //             // try {
    //             //     console.log("sssss");
    //             //     request(server).post("/hello/api/users/login").send({ "email": email, "password": password }).expect(10).end(async function (err, res) {
    //             //         if (err) throw err;
    //             //         console.log(res);
    //             //     });
    //             //     // await User.remove({});

    //             // } catch (error) {
    //             //     expect(error).toMatch("error");
    //             // }

    //         });
    //     });
    // });
    describe("POST /hello/api/users/list ", () => {
        /* ------------------------------- happy path ------------------------------- */
        it("should return count of three document of users collection ", async () => {
            for (let index = 0; index < 3; index++) {
                const name = "testtest"+index;
                const email = "test@test.com"+index;
                const password = "123456";
                const user = new User({
                    "name": name,
                    "email": email,
                    "password": password
                });

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                user.password = hash;
                await user.save();

            }
            const result = await request(server).get("/hello/api/users/list").header({  });
            expect(result.status).toBe(200);
            
        });
        it("should return 400 status code if you don't have permission for have users list ", () => {

        });
    });
    describe("POST /hello/api/users/login ", () => {
        it("should return 200 after login", async () => {
            const name = "testtest3";
            const email = "test@test.com";
            const password = "123456";
            const user = new User({
                "name": name,
                "email": email,
                "password": password
            });

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const result = await request(server).post("/hello/api/users/login").send({ "email": email, "password": password });
            expect(result.status).toBe(200);
            // await User.remove({});

        });
        it("should return 400 if email was wrong", async () => {
            const name = "testtest2";
            const email = "test@test.com";
            const password = "123456";
            const user = new User({
                "name": name,
                "email": email,
                "password": password
            });

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const result = await request(server).post("/hello/api/users/login").send({ "email": "wrongEmail", "password": password });
            await User.remove({});
            expect(result.status).toBe(400);
        });
        it("should return 400 if password was wrong", async () => {
            console.log("3");
            const name = "testtest1";
            const email = "test@test.com";
            const password = "123456";
            const user = new User({
                "name": name,
                "email": email,
                "password": password
            });

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;
            await user.save();
            const result = await request(server).post("/hello/api/users/login").send({ "email": email, "password": "WrongPass" });
            await User.remove();
            expect(result.status).toBe(400);

        });
    });
});
