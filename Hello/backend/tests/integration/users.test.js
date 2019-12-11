const request = require("supertest");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");

describe("/api/users/test", () => {
    let server;
    beforeEach(() => {
        server = require("../../index");
    });
    afterAll(async () => {
        // await User.remove({});
        console.log("afterAll");
        await server.close();
    });
    describe("POST /hello/api/users/login ", () => {
        it("should return 200 after login", async () => {
            console.log("1");
            const name = "testtest3";
            const email = "test@test.com";
            const password = "123456";
            const user = new User({
                "name": name,
                "email": email,
                "password": password
            });

            bcrypt.genSalt(10, async function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    user.password = hash;
                    await user.save();
                    await request(server).post("/hello/api/users/login").send({ "email": email, "password": password }).expect(200);

                });
            });
        });
        it("should return 400 if email was wrong", async () => {
            console.log("2");
            const name = "testtest2";
            const email = "test@test.com";
            const password = "123456";
            const user = new User({
                "name": name,
                "email": email,
                "password": password
            });

            bcrypt.genSalt(10, async function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    user.password = hash;
                    await user.save();
                    await request(server).post("/hello/api/users/login").send({ "email": "wrongEmail", "password": password }).expect(400);

                });
            });
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

            bcrypt.genSalt(10, async function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    user.password = hash;
                    await user.save();
                    await request(server).post("/hello/api/users/login").send({ "email": email, "password": "WrongPass" }).expect(400);
                });
            });
        });
        afterEach(async () => {
            // await User.remove({});
            // console.log("afterEach");
            await User.remove({});

        });
    });
});