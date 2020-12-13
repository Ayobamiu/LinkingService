const app = require("../app");
const request = require("supertest");
const User = require("../models/users.model");
const {
  userOneID,
  userOne,
  setUpDatabase,
  userTwoID,
  userTwo,
} = require("./fixtures/db");

beforeAll(setUpDatabase);

test("Should sign up a new user", async () => {
  const response = await request(app)
    .post("/auth/sign-up")
    .send({
      firstName: "Test User",
      email: "test@user.com",
      password: "testing101",
    })
    .expect(201);

  //Assert that a new user has been created
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertion about the response
  expect(response.body.status).toBe("success");
  expect(user.password).not.toBe("testing101");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/auth/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(userOneID);
  //Assert token is correct
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login non-existing user", async () => {
  await request(app)
    .post("/auth/login")
    .send({
      email: "newuser@test.com",
      password: "newuser!!!",
    })
    .expect(400);
});

