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

// Invalid password
describe("POST register endpoint - test with invalid password", () => {
  test("Should respond 401", async () => {
    const response = await request.post("/login").send({
      username: "Kwoodfield",
      password: "Password3",
    });
    expect(response.status).toEqual(401);
  });
});

// Logout without 
describe("POST logout endpoint", () => {
  test("Should respond 500", async () => {
    const response = await request.post("/logout").send({
      username: "Kwoodfield",
      password: "Password3",
    });
    expect(response.status).toEqual(500);
  });
});
