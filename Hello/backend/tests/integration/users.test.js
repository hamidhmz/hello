const request = require("supertest");

let server;

describe("/api/genres", () => {
    beforeEach(() => {
        const server = require("../../index");
    });
    afterEach(() => {
        server.close();
    });
    describe("GET /", () => {
        it("should return one user details", async () => {
            const res = await request(server).get("/hello/api/users/test");
            expect(res.status).toBe(200);
        });
    });
});