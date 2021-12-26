/** @format */

var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const express = require("express");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth.middleware");
const User = require("../models/users.model");
const upload = require("../bucket-config/bucket");
const worldLowRes = require("../config/world.json");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "327841086527-5obdqenuk320vlq20gt86qfepb3do3ac.apps.googleusercontent.com",
      clientSecret: "39btqVrYaWKzYuia2pnazm_W",
      callbackURL: "https://monaly-app.herokuapp.com",
    },
    function (accessToken, refreshToken, profile, done) {
      User.create(
        {
          googleId: profile.id,
          userName: profile.username,
          email: profile.emails || "new@user.com",
        },
        function (err, user) {
          return done(err, user);
        }
      );
      console.log("profile", profile);
    }
  )
);

const {
  sendWelcomeEmail,
  sendCancellationEmail,
  resetPasswordMessage,
} = require("../emails/account");
const Themes = require("../models/themes.model");
const UserView = require("../models/artistViews.model");
const ShippingAddress = require("../models/shippingAddress.model");
const Transaction = require("../models/transaction.model");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(req);
    res.redirect("/");
  }
);

router.post("/check-username", async (req, res) => {
  try {
    const userNameExists = await User.findOne({ userName: req.body.userName });

    if (userNameExists) {
      return res.status(400).send({
        status: "400 Bad request",
        error: "Username taken.",
      });
    }
    if (!userNameExists) {
      return res.status(200).send({
        status: "200 succesfull",
        error: "Username available!",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "500 Internal server error",
      error: "Error saving User",
    });
  }
});

router.post("/sign-up", AuthController.signUpLite);

router.post("/login", AuthController.login);

//upload user images
router.post(
  "/me/images",
  auth,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),

  async (req, res) => {
    if (req.files.profilePhoto) {
      req.user.profilePhoto = req.files.profilePhoto[0].location;
    }
    if (req.files.coverPhoto) {
      req.user.coverPhoto = req.files.coverPhoto[0].location;
    }
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
  const users = await User.find({})
    .populate("linksCount productsCount storesCount")
    .select(
      "firstName lastName userName profilePhoto email linksCount productsCount storesCount"
    );
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
  const user = await User.findOne({ _id: req.user._id }).populate({
    path: "theme addresses stores",
  });
  res.send(user);
});

router.get("/me/views", auth, async (req, res) => {
  const visitors = await UserView.find({ user: req.user._id }).populate({
    path: "visitor",
    select: "firstName lastName email",
  });
  const countries = [];
  worldLowRes.layers.forEach((country) => {
    let item = { ...country };
    const countryMatches = visitors.filter(
      (visitor) =>
        visitor.country &&
        visitor.country.toLowerCase() === country.name.toLowerCase()
    );

    country.count = countryMatches.length;
    return country;
  });
  res.send({ visitors, countries: worldLowRes });
});

router.get("/me/transactions", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    res.status(200).send({ transactions });
  } catch (error) {
    res.status(500).send({ error });
  }
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
    "password",
    "age",
    "category",
    "firstName",
    "lastName",
    "userName",
    "bio",
    "location",
    "profileTitle",
    "stackStyle",
    "theme",
    "storeName",
    "storeAddress",
    "storePhoneOne",
    "storePhoneTwo",
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
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: "theme",
    });

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch(
  "/me/storelogo",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          storeLogo: req.file.location,
        },
        { new: true }
      );

      res.send({ storeLogo: user.storeLogo });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

router.post("/start-reset-password", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "Email not registered." });
    }
    const token = jwt.sign(
      { _id: user._id.toString(), email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    resetPasswordMessage(email, token);
    res.send({ message: "Reset password link sent" });
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/reset-password/:token", async (req, res) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded._id;
  const userEmail = decoded.email;
  const password_one = req.body.password_one;
  const password_two = req.body.password_two;
  if (password_one !== password_two) {
    return res.status(400).send({ error: "Passwords are not a match." });
  }
  try {
    const user = await User.findOne({ _id: userId, email: userEmail });
    if (!user) {
      return res.status(400).send({ error: "Email not registered." });
    }
    user.password = password_one;
    await user.save();
    res.send({ message: "Password changed successfully", user });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/add-address", auth, async (req, res) => {
  try {
    // const user = await User.findById(req.user._id)

    const newAddress = await ShippingAddress.create({
      ...req.body,
      user: req.user._id,
    });

    res.send({ address: newAddress });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
