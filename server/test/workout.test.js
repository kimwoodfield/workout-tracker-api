const supertest = require("supertest");
const app = require("../server.js");
const request = supertest(app);

// Mock cookie
let cookie;

// Mock login
beforeAll(async () => {
  const res = await request.post("/login").send({
    username: "Kwoodfield",
    password: "Password1",
  });
  // Mock cookie
  const cookies = res.headers["set-cookie"][0]
    .split(",")
    .map((item) => item.split(";")[0]);
  cookie = cookies.join(";");
  console.log(cookie);
});

// Test GET for workout
describe("GET workout endpoint without auth", () => {
  test("Should respond 401", async () => {
    const response = await request.get("/workout");
    expect(response.status).toEqual(401);
  });
});
