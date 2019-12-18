const request = require("supertest");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");
// const expect = require("chai").expect;

describe("/api/users/test", () => {
    let server;

    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        try {
            await User.remove({});
            await server.close();
        } catch (error) {
            console.log(error);
        }
    });
    describe("POST /hello/api/users/list ", () => {
        /* ------------------------------- happy path ------------------------------- */
        it("should return count of three document of users collection ", async () => {
            for (let index = 0; index < 3; index++) {
                const name = "testtest" + index;
                const email = "test@test.com" + index;
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
            const result = await request(server).get("/hello/api/users/list").header({});
            expect(result.status).toBe(200);

        });
        it("should return 400 status code if you don't have permission for have users list ", async () => {
            for (let index = 0; index < 3; index++) {
                const name = "testtest" + index;
                const email = "test@test.com" + index;
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
            const result = await request(server).get("/hello/api/users/list").header({});
            expect(result.status).toBe(400);
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
