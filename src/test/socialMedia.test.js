const app = require("../app");
const request = require("supertest");
const DigitalPlatform = require("../models/digitalPlatforms.model");

const {
  userOne,
  setUpDatabase,
  platformOneID,
  socialOneID,
} = require("./fixtures/db");
const SocialMedia = require("../models/socialMedia.model");

beforeAll(setUpDatabase);

test("Should add a new social platform", async () => {
  const response = await request(app)
    .post("/socials/add")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      mediaPlatformSample: "5fd60ab079d63b40c0db7e79",
      link: "www.test.com",
    })
    .expect(201);

  //Assert that a new socialMedia has been created
  const socialMedia = await SocialMedia.findById(response.body._id);
  expect(socialMedia).not.toBeNull();

  //Assertion about the response
  expect(socialMedia.link).toBe("www.test.com");
});

test("Should not add a new social platform in case of bad Input", async () => {
  const response = await request(app)
    .post("/socials/add")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      mediaPlatformSample: "1",
      link: "wwwcom",
    })
    .expect(400);
});

test("Should not delete a socialMedia platform if user is not authenticated", async () => {
  const response = await request(app)
    .delete("/socials/" + socialOneID + "/remove")
    .expect(401);
});

test("Should delete a socialMedia platform", async () => {
  const response = await request(app)
    .delete("/socials/" + socialOneID + "/remove")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  //Assert that a new user has been created
  const socialMedia = await SocialMedia.findById(response.body._id);
  expect(socialMedia).toBeNull();
});
