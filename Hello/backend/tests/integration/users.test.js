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
    describe("GET /hello/api/users/list ", () => {
        /* ------------------------------- happy path ------------------------------- */
        it("should return count of three document of users collection ", async () => {
            let lastUser;
            let passwordArray = [];
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
                passwordArray[index] = hash;
                await user.save();
                if (index == 2) {
                    lastUser = user.generateAuthToken();
                }
            }
            const result = await request(server).get("/hello/api/users/list").set({ "x-auth-token": lastUser });
            expect(result.status).toBe(200);
            expect(result.body.length).toBe(3);
            expect(result.body[0].name).toBe("testtest0");
            expect(result.body[0].email).toBe("test@test.com0");
            expect(result.body[0].password).toBe(passwordArray[0]);

            expect(result.body[1].name).toBe("testtest1");
            expect(result.body[1].email).toBe("test@test.com1");
            expect(result.body[1].password).toBe(passwordArray[1]);

            expect(result.body[2].name).toBe("testtest2");
            expect(result.body[2].email).toBe("test@test.com2");
            expect(result.body[2].password).toBe(passwordArray[2]);

        });
        it("should return 400 status code if user use wrong token ", async () => {
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
            const result = await request(server).get("/hello/api/users/list").set({ "x-auth-token": "wrong token" });
            expect(result.status).toBe(400);
        });
        it("should return 401 status code if doesn't have any token  ", async () => {
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
            const result1 = await request(server).get("/hello/api/users/list").set({ "x-auth-token": "" });
            expect(result1.status).toBe(401);
            const result2 = await request(server).get("/hello/api/users/list");
            expect(result2.status).toBe(401);
        });
    });
    describe("GET /hello/api/users/me", () => {
        /* ------------------------------- happy path ------------------------------- */
        it("should return correct user document ", async () => {
            const name = "testtest";
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
            const token = user.generateAuthToken();

            const result = await request(server).get("/hello/api/users/me").set({ "x-auth-token": token });
            expect(result.status).toBe(200);
            expect(result.body.name).toBe(user.name);
            expect(result.body.email).toBe(user.email);

        });
        it("should return 401 status for doesn't any token", async () => {
            const name = "testtest";
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
            const token = user.generateAuthToken();

            const result = await request(server).get("/hello/api/users/me").set({ "x-auth-token": "" });
            expect(result.status).toBe(401);
            const result1 = await request(server).get("/hello/api/users/me").set({ "x-auth-token": " " });
            expect(result1.status).toBe(401);
            const result2 = await request(server).get("/hello/api/users/me");
            expect(result2.status).toBe(401);

        });
        it("should return 400 status for wrong token ", async () => {
            const name = "testtest";
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
            const token = user.generateAuthToken();

            const result2 = await request(server).get("/hello/api/users/me").set({ "x-auth-token": "wrong token" });
            expect(result2.status).toBe(400);
        });
    });

    describe("POST /hello/api/users/register ", () => {
        /* ------------------------------- happy path ------------------------------- */
        it("should return 200 after register and return user", async () => {
            const name = "testtest";
            const email = "test@test.com";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });
            expect(result.status).toBe(200);
            expect(result.body.name).toBe(name);
            expect(result.body.email).toBe(email);

        });
        it("should return error with 400 status code if name was little than 5 characters ", async () => {
            const name = "test";
            const email = "test@test.com";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"name\" length must be at least 5 characters long");
        });
        it("should return error with 400 status code if name was more than 50 characters ", async () => {
            const name = "123456789112345678911234567891123456789112345678912";
            const email = "test@test.com";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"name\" length must be less than or equal to 50 characters long");
        });
        it("should return error with 400 status code if name doesn't exists ", async () => {
            const name = "testtest";
            const email = "test@test.com";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"name\" is required");
        });
        it("should return error with 400 status code if email wasn't valid ", async () => {
            const name = "testtest";
            const email = "testtest.com";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"email\" must be a valid email");
        });
        it("should return error with 400 status code if email was more than 50 characters ", async () => {
            const name = "testtest";
            const email = "test@test.123456789112345678911234567891123456789112345678912";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"email\" length must be less than or equal to 50 characters long");
        });
        it("should return error with 400 status code if email doesn't exists ", async () => {
            const name = "testtest";
            const email = "test@test.com";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"email\" is required");
        });
        it("should return error with 400 status code if email was duplicate ", async () => {
            const name = "testtest";
            const email = "test@test.com";
            const password = "123456";

            await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });
            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("User already registered.");
        });
        it("should return error with 400 status code if password was little than 5 characters ", async () => {
            const name = "testtest";
            const email = "test@test.com";
            const password = "1234";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"password\" length must be at least 5 characters long");
        });
        it("should return error with 400 status code if password was more than 50 characters ", async () => {
            const name = "testtest";
            const email = "test@test.com";
            const password = "123456789112345678911234567891123456789112345678912";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email, "password": password });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"password\" length must be less than or equal to 50 characters long");
        });
        it("should return error with 400 status code if password doesn't exists ", async () => {
            const name = "testtest";
            const email = "test@test.com";
            const password = "123456";

            const result = await request(server).post("/hello/api/users/register").send({ "name": name, "email": email });

            expect(result.status).toBe(400);
            expect(result.text).toBe("\"password\" is required");
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

            expect(result.status).toBe(400);

        });
    });
    describe("POST /hello/api/users/edit-name-or-email", () => {
        /* ------------------------------- happy path ------------------------------- */
        it("should change email and name", async () => {
            const name = "testtest";
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
            const token = user.generateAuthToken();
            const name2 = "testtest2";
            const email2 = "test@test.com2";
            const result = await request(server).post("/hello/api/users/edit-name-or-email").set({ "x-auth-token": token }).send({ "name": name2, "email": email2 });
            await Model.find({ 
                field: filter
            }, (err, docs) => {
               if(err){
                   console.log(`Error: ` + err)
               } else{
                 if(docs.length === 0){
                     console.log("message")
                 } else{
                   
                 }
               }
            });
            expect(result.status).toBe(200);
            expect(user.name).toBe(name2);
            expect(user.email).toBe(email2);
        });
        it("should return error with 400 status code if name doesn't exists ", async () => {

        });
        it("should return error with 400 status code if name was little than 5 characters ", async () => {

        });
        it("should return error with 400 status code if name was more than 50 characters ", async () => {

        });
        it("should return error with 400 status code if email doesn't exists ", async () => {

        });
        it("should return 400 token was invalid ", async () => {

        });
        it("should return error with 400 status code if email was duplicate ", async () => {

        });
        it("should return error with 400 status code if email wasn't valid ", async () => {

        });
        it("should return error with 400 status code if email was more than 50 characters ", async () => {

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

            expect(result.status).toBe(400);

        });
    });
});
