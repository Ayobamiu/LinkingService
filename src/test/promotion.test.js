const app = require("../app");
const request = require("supertest");

const { userOne, setUpDatabase } = require("./fixtures/db");
const Promotion = require("../models/promotion.model");

beforeAll(setUpDatabase);

test("Should add a new promotion", async () => {
  const response = await request(app)
    .post("/promotions/add")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .field(
      "digitalPlatforms[0][mediaPlatformSample]",
      "5feef92adff41b3054326eaf"
    )
    .field("digitalPlatforms[0][link]", "www.link.com")
    .field("title", "Test title")
    .field("type", "ep")
    .expect(201);

  //Assert that a new promotion has been created
  const promotion = await Promotion.findById(response.body._id);
  expect(promotion).not.toBeNull();

  //Assertion about the response
  expect(promotion.title).toBe("Test title");
});
