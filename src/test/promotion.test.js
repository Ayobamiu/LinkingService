const app = require("../app");
const request = require("supertest");

const {
  userOne,
  setUpDatabase,
  promotionOne,
  promotionTwoID,
} = require("./fixtures/db");
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

test("Should not add a new promotion if user is not Authenticated", async () => {
  const response = await request(app)
    .post("/promotions/add")
    .field(
      "digitalPlatforms[0][mediaPlatformSample]",
      "5feef92adff41b3054326eaf"
    )
    .field("digitalPlatforms[0][link]", "www.link.com")
    .field("title", "Test title")
    .field("type", "ep")
    .expect(401);
});

test("Should return a promotion", async () => {
  const response = await request(app)
    .get("/promotions/" + promotionOne._id)
    .expect(200);

  //Assert that a new promotion has been created
  const promotion = await Promotion.findById(response.body._id);
  expect(promotion).not.toBeNull();

  //Assertion about the response
  expect(promotion.title).toBe("test ep");
});

test("Should NOT return a promotion if it is absent", async () => {
  const response = await request(app)
    .get("/promotions/" + promotionTwoID)
    .expect(404);
});
