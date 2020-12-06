const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/users.model");

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  name: "UserOne",
  email: "user@one.com",
  password: "userOne!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneID }, "myjwtsecretkey"),
    },
  ],
};
const userTwoID = new mongoose.Types.ObjectId();
const userThreeID = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoID,
  name: "UserTwo",
  email: "user@two.com",
  password: "usertwo!!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoID }, "myjwtsecretkey"),
    },
  ],
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
};
const clearDatabse = async () => {
  await User.deleteOne({ _id: userOneID });
  await User.deleteOne({ _id: userTwoID });
  await User.deleteOne({ _id: userThreeID });
};

module.exports = {
  userOneID,
  userOne,
  setUpDatabase,
  clearDatabse,
  userTwoID,
  userTwo,
  userThreeID,
};
