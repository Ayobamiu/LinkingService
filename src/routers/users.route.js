const express = require("express");
const auth = require("../middlewares/auth.middleware");
const User = require("../models/users.model");

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).send({
        status: "400 Bad request",
        error: "Email is taken",
      });
    }
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ status: "success", user, token });
  } catch (error) {
    res.status(500).send({
      status: "500 Internal server error",
      error: "Error saving User",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/users", auth, async (req, res) => {
  const users = await User.find({});
  try {
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    //remove user currently used token from user's token list
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //remove all users tokens from user's token list
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
