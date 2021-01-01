const app = require("../app");
const request = require("supertest");
const { userOne, setUpDatabase } = require("./fixtures/db");
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

// test("Should return a promotion", async () => {
//   const response = await request(app)
//     .get("/promotions/" + promotionOne._id)
//     .expect(200);

//   //Assert that a new promotion has been created
//   const promotion = await Promotion.findById(response.body._id);
//   expect(promotion).not.toBeNull();

//   //Assertion about the response
//   expect(promotion.title).toBe("test ep");
// });

// test("Should NOT return a promotion if it is absent", async () => {
//   const response = await request(app)
//     .get("/promotions/" + promotionTwoID)
//     .expect(404);
// });
