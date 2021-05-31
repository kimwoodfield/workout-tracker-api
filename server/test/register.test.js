const supertest = require("supertest");
const app = require("../server.js");
// const request = supertest(app);
// const router = require("../routes/register");
const request = supertest(app);

// Mock cookie
let cookie;

// // Mock login
// beforeAll(async (done) => {
//   const res = await request.post("/login").send({
//     username: "Lstephan",
//     password: "Password1",
//   });
//   // Mock cookie
//   const cookies = res.headers["set-cookie"][0]
//     .split(",")
//     .map((item) => item.split(";")[0]);
//   cookie = cookies.join(";");
//   done();
// });

// Test successful register
describe("POST register endpoint - successful", () => {
  test("Should respond 201", async () => {
    const response = await request.post("/register").send({
      email: "Fmercury@gmail.com",
      fullname: "Freddy Mercury",
      username: "Fmercury",
      password: "Password1",
    });
    expect(response.status).toEqual(201);
  });
});
