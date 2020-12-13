const express = require("express");
const auth = require("../middlewares/auth.middleware");
const User = require("../models/users.model");
const upload = require("../bucket-config/bucket");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");

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
    // sendWelcomeEmail(user.email, user.name);
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

//upload user images
router.post(
  "/me/images",
  auth,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    req.user.profilePhoto = req.files.profilePhoto[0].location;
    req.user.coverPhoto = req.files.coverPhoto[0].location;
    try {
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      res.status(400).send();
    }
  }
);

//update user images
router.patch(
  "/me/images",
  auth,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    req.user.profilePhoto = req.files.profilePhoto[0].location;
    req.user.coverPhoto = req.files.coverPhoto[0].location;
    try {
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      res.status(400).send();
    }
  }
);

//delete user profilePhoto
router.delete("/me/profilePhoto", auth, async (req, res) => {
  req.user.profilePhoto = undefined;
  try {
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});

//delete user coverPhoto
router.delete("/me/coverPhoto", auth, async (req, res) => {
  req.user.coverPhoto = undefined;
  try {
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/users", async (req, res) => {
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

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "email",
    "password",
    "age",
    "category",
    "firstName",
    "lastName",
    "stageName",
    "bio",
    "location",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
