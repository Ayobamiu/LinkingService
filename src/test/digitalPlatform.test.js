const app = require("../app");
const request = require("supertest");
const DigitalPlatform = require("../models/digitalPlatforms.model");

const {
  userOne,
  setUpDatabase,
} = require("./fixtures/db");

beforeAll(setUpDatabase);

test("Should add a new digital platform", async () => {
  const response = await request(app)
    .post("/platforms/add")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Test Platform",
      link: "www.test.com",
    })
    .expect(201);

  //Assert that a new user has been created
  const platform = await DigitalPlatform.findById(response.body._id);
  expect(platform).not.toBeNull();

  //Assertion about the response
  expect(platform.link).toBe("www.test.com");
});
