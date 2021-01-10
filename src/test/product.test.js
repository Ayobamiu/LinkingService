const app = require("../app");
const request = require("supertest");

const {
  userOne,
  setUpDatabase,
  productOne,
  userOneID,
  orderOne,
} = require("./fixtures/db");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

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

  //Assert that product was deleted
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

test("Should return a product", async () => {
  await request(app)
    .get("/products/" + productOne._id)
    .expect(200);
});

test("Should not return a product if product is absent", async () => {
  await request(app)
    .get("/products/" + userOneID)
    .expect(404);
});

test("Should add a new order", async () => {
  const response = await request(app)
    .post("/products/" + productOne._id + "/order")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(201);

  //Assert that product was created
  const order = await Order.findById(response.body._id);
  expect(order).not.toBeNull();
}, 30000);

test("Should not add a new order if user is not authenticated", async () => {
  const response = await request(app)
    .post("/products/" + productOne._id + "/order")
    .expect(401);
}, 30000);

test("Should update a product if a user is authenticated", async () => {
  const response = await request(app)
    .patch("/products/" + productOne._id + "/update")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ title: "Updated Product Title" })
    .expect(200);

  //Assert that a product has been updated
  const product = await Product.findById(response.body._id);
  expect(product.title).toBe("Updated Product Title");
});

test("Should NOT update a product if a user is not authenticated", async () => {
  await request(app)
    .patch("/products/" + productOne._id + "/update")
    .send({ title: "Updated Product Title" })
    .expect(401);
});

test("Should update an order if a user is authenticated", async () => {
  const response = await request(app)
    .patch("/products/" + orderOne._id + "/update-order")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ quantity: 10 })
    .expect(200);

  //Assert that an order has been updated
  const order = await Order.findById(response.body._id);
  expect(order.quantity).toBe(10);
});

test("Should NOT update a product if a user is not authenticated", async () => {
  await request(app)
    .patch("/products/" + orderOne._id + "/update-order")
    .send({ quantity: 10 })
    .expect(401);
});

test("Should delete a product", async () => {
  const response = await request(app)
    .delete("/products/" + productOne._id + "/remove")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const product = await Product.findById(response.body._id);
  expect(product).toBeNull();
});

test("Should not delete a product if user is not authenticated", async () => {
  await request(app)
    .delete("/products/" + productOne._id + "/remove")
    .expect(401);
});
