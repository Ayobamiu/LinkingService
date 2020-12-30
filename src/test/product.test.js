const app = require("../app");
const request = require("supertest");

const { userOne, setUpDatabase } = require("./fixtures/db");
const Product = require("../models/product.model");

beforeAll(setUpDatabase);

test("Should add a new product", async () => {
  const response = await request(app)
    .post("/products/add")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .field("title", "Test product")
    .field("description", "Description for Test product")
    .field("cta", "5fd60ab079d63b40c0db7e79")
    .field("price", "50")
    .expect(201);

  //Assert that a new user has been created
  const product = await Product.findById(response.body._id);
  expect(product).not.toBeNull();

  //Assertion about the response
  expect(product.title).toBe("Test product");
}, 30000);

test("Should not add a new product if user is not authenticated", async () => {
  const response = await request(app)
    .post("/products/add")
    .field("title", "Test product")
    .field("description", "Description for Test product")
    .field("cta", "5fd60ab079d63b40c0db7e79")
    .field("price", "50")
    .expect(401);
}, 30000);

// test("Should not add a new digital platform if user is not authenticated", async () => {
//   const response = await request(app)
//     .post("/platforms/add")
//     .send({
//       name: "Test Platform",
//       link: "www.test.com",
//     })
//     .expect(401);
// });

// test("Should update a digital platform", async () => {
//   const response = await request(app)
//     .patch("/platforms/" + platformOneID + "/update")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .send({ link: "www.newtest.com" })
//     .expect(200);

//   //Assert that a new user has been created
//   const platform = await DigitalPlatform.findById(response.body._id);
//   expect(platform.link).toBe("www.newtest.com");
// });

// test("Should not update a digital platform if user is not authenticated", async () => {
//   const response = await request(app)
//     .patch("/platforms/" + platformOneID + "/update")
//     .expect(401);
// });

// test("Should delete a digital platform", async () => {
//   const response = await request(app)
//     .delete("/platforms/" + platformOneID + "/remove")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .expect(200);

//   //Assert that a new user has been created
//   const platform = await DigitalPlatform.findById(response.body._id);
//   expect(platform).toBeNull();
// });

// test("Should not delete a digital platform if user is not authenticated", async () => {
//   const response = await request(app)
//     .delete("/platforms/" + platformOneID + "/remove")
//     .expect(401);
// });