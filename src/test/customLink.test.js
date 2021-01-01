const app = require("../app");
const request = require("supertest");
const {
  userOne,
  setUpDatabase,
  customLinkOne,
  customLinkTwoID,
} = require("./fixtures/db");
const CustomLink = require("../models/customLink.model");

beforeAll(setUpDatabase);

test("Should add a new customLink", async () => {
  const response = await request(app)
    .post("/custom-links/add")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ title: "Test link", link: "www.test.com" })
    .expect(201);

  //Assert that a new customLink has been created
  const customLink = await CustomLink.findById(response.body._id);
  expect(customLink).not.toBeNull();

  //Assertion about the response
  expect(customLink.title).toBe("Test link");
});

test("Should not add a new customLink if user is not Authenticated", async () => {
  await request(app)
    .post("/custom-links/add")
    .send({ title: "Test link", link: "www.test.com" })
    .expect(401);
});

test("Should return a customLink", async () => {
  const response = await request(app)
    .get("/custom-links/" + customLinkOne._id)
    .expect(200);

  //Assert that a new customLink has been created
  const customLink = await CustomLink.findById(response.body._id);
  expect(customLink).not.toBeNull();

  //Assertion about the response
  expect(customLink.title).toBe("Test Link");
});

test("Should NOT return a customLink if it is absent", async () => {
  await request(app)
    .get("/custom-links/" + customLinkTwoID)
    .expect(404);
});
