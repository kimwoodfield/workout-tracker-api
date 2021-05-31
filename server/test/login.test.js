const supertest = require("supertest");
const app = require("../server.js");
const request = supertest(app);

// Test login endpoints

// Successful login
describe("POST register endpoint - successful", () => {
  test("Should respond 201", async () => {
    const response = await request.post("/login").send({
      username: "Kwoodfield",
      password: "Password1",
    });
    expect(response.status).toEqual(201);
  });
});

// Unsuccessful login
describe("POST register endpoint - successful", () => {
    test("Should respond 401", async () => {
      const response = await request.post("/login").send({
        username: "Kwoodfield",
        password: "Password3",
      });
      expect(response.status).toEqual(401);
    });
  });