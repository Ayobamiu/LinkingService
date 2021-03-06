const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/users.model");
const DigitalPlatform = require("../../models/digitalPlatforms.model");
const SocialMedia = require("../../models/socialMedia.model");
const Product = require("../../models/product.model");
const Promotion = require("../../models/promotion.model");
const CustomLink = require("../../models/customLink.model");
const Order = require("../../models/order.model");

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  email: "user@one.com",
  password: "userOne!!",
  userName: "user One",
  slug: "@userOne",
  tokens: [
    {
      token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
    },
  ],
};

const userToFollowID = new mongoose.Types.ObjectId();
const userToFollow = {
  _id: userToFollowID,
  email: "usertofollow@one.com",
  password: "userToFollow!!",
  userName: "user One",
  slug: "@userToFollow",
  tokens: [
    {
      token: jwt.sign({ _id: userToFollowID }, process.env.JWT_SECRET),
    },
  ],
};
const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoID,
  email: "user@two.com",
  password: "usertwo!!",
  userName: "user Two",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET),
    },
  ],
};

const platformOneID = new mongoose.Types.ObjectId();
const platformOne = {
  _id: platformOneID,
  artist: userOneID,
  name: "Testing Platform",
  link: "www.test.com",
};
const productOneID = new mongoose.Types.ObjectId();
const productOne = {
  _id: productOneID,
  user: userOneID,
  title: "First Product",
  description: "description of First Product",
  cta: "5fd60ab079d63b40c0db7e79",
  price: 60,
};

const orderOneID = new mongoose.Types.ObjectId();
const orderOne = {
  _id: orderOneID,
  buyer: userOneID,
  product: productOneID,
};

const socialOneID = new mongoose.Types.ObjectId();
const socialOne = {
  _id: socialOneID,
  user: userOneID,
  link: "www.test.com",
};

const promotionOneID = new mongoose.Types.ObjectId();
const promotionTwoID = new mongoose.Types.ObjectId();
const promotionOne = {
  _id: promotionOneID,
  user: userOneID,
  type: "ep",
  title: "test ep",
};
const customLinkOneID = new mongoose.Types.ObjectId();
const customLinkTwoID = new mongoose.Types.ObjectId();
const customLinkOne = {
  _id: customLinkOneID,
  owner: userOneID,
  title: "Test Link",
  link: "www.ep.com",
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await DigitalPlatform.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userToFollow).save();
  await new DigitalPlatform(platformOne).save();
  await new SocialMedia(socialOne).save();
  await new Product(productOne).save();
  await new Promotion(promotionOne).save();
  await new CustomLink(customLinkOne).save();
  await new Order(orderOne).save();
};

module.exports = {
  userOneID,
  userOne,
  setUpDatabase,
  userTwoID,
  userTwo,
  userToFollowID,
  userToFollow,
  platformOneID,
  socialOneID,
  productOne,
  promotionOne,
  promotionTwoID,
  customLinkOne,
  customLinkTwoID,
  orderOne,
};
