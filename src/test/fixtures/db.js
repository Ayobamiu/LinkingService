const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/users.model");
const DigitalPlatform = require("../../models/digitalPlatforms.model");
const SocialMedia = require("../../models/socialMedia.model");

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  email: "user@one.com",
  password: "userOne!!",
  stageName: "user One",
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
  stageName: "user One",
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
  stageName: "user Two",
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

const socialOneID = new mongoose.Types.ObjectId();
const socialOne = {
  _id: socialOneID,
  user: userOneID,
  link: "www.test.com",
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await DigitalPlatform.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userToFollow).save();
  await new DigitalPlatform(platformOne).save();
  await new SocialMedia(socialOne).save();
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
};
