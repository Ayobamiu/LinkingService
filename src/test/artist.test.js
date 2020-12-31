const app = require("../app");
const request = require("supertest");

const {
  setUpDatabase,
  userToFollowID,
  userToFollow,
  userOneID,
} = require("./fixtures/db");
const User = require("../models/users.model");

beforeAll(setUpDatabase);

test("Should add a new artistView when artist is present", async () => {
  const user = await User.findById(userOneID);
  await request(app).get(`/artists/${user.slug}`).expect(201);
});
test("Should return products for a user", async () => {
  const user = await User.findById(userOneID);
  await request(app).get(`/artists/${user.slug}/store`).expect(200);
});

test("Should add a new follow, if it doesn't exist", async () => {
  const response = await request(app)
    .post("/artists/" + userToFollowID + "/follow")
    .set("Authorization", `Bearer ${userToFollow.tokens[0].token}`)
    .expect(201);

  //Assert that a user has been updated
  const user = await User.findById(response.body.artist);
  expect(user.followerCount).not.toEqual(0);
});

test("Should NOT add a new follow, if it exist", async () => {
  const response = await request(app)
    .post("/artists/" + userToFollowID + "/follow")
    .set("Authorization", `Bearer ${userToFollow.tokens[0].token}`)
    .expect(201);

  //Assert that a user has been updated
  const user = await User.findById(response.body.artist);
  expect(user.followerCount).toEqual(0);
});

test("Should add a new like, if it doesn't exist", async () => {
  const response = await request(app)
    .post("/artists/" + userToFollowID + "/like")
    .set("Authorization", `Bearer ${userToFollow.tokens[0].token}`)
    .expect(201);

  //Assert that a user has been updated
  const user = await User.findById(response.body.artist);
  expect(user.likeCount).not.toEqual(0);
});

test("Should NOT add a new like, if it exist", async () => {
  const response = await request(app)
    .post("/artists/" + userToFollowID + "/like")
    .set("Authorization", `Bearer ${userToFollow.tokens[0].token}`)
    .expect(201);

  //Assert that a user has been updated
  const user = await User.findById(response.body.artist);
  expect(user.likeCount).toEqual(0);
});
