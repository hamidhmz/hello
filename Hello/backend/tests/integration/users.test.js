const request = require("supertest");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user");

describe("/api/users/test", () => {
    let server;
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await server.close();
    });
    describe("GET /", async () => {
        it("should return one user details", async () => {
            const name = "test";
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
                    
                    request(server).get("/login").expect(200);
                });
            });
        });
    });
});