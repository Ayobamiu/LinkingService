/** @format */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
var uniqueSlug = require("unique-slug");
const EcommerceStore = require("./store.model");

// var randomSlug = uniqueSlug()
// var fileSlug = uniqueSlug('/etc/passwd')

const userSchema = mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["artist", "visitor"],
      default: "artist",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    profileTitle: {
      type: String,
    },
    slug: {
      type: String,
    },
    storeName: {
      type: String,
    },
    storeAddress: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
      trim: true,
    },
    occupation: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    stackStyle: {
      type: String,
      default: "stacked",
    },
    coverPhoto: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    storeLogo: {
      type: String,
    },
    storePhoneOne: {
      type: String,
    },
    storePhoneTwo: {
      type: String,
    },
    googleId: {
      type: String,
    },
    expoPushToken: {
      type: String,
    },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Themes",
      default: "6085c02da2d19336940c8509",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    ledgerBalance: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

userSchema.virtual("customLinks", {
  ref: "CustomLink",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("linksCount", {
  ref: "CustomLink",
  localField: "_id",
  foreignField: "owner",
  count: true, // And only get the number of docs
});

userSchema.virtual("platforms", {
  ref: "DigitalPlatform",
  localField: "_id",
  foreignField: "artist",
});
userSchema.virtual("socialMediaplatforms", {
  ref: "SocialMedia",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("productsCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "user",
  count: true, // And only get the number of docs
});
userSchema.virtual("stores", {
  ref: "EcommerceStore",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("storesCount", {
  ref: "EcommerceStore",
  localField: "_id",
  foreignField: "user",
  count: true, // And only get the number of docs
});
userSchema.virtual("addresses", {
  ref: "ShippingAddress",
  localField: "_id",
  foreignField: "user",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      profileTitle: user.profileTitle,
      email: user.email,
      bio: user.bio,
      coverPhoto: user.coverPhoto,
      profilePhoto: user.profilePhoto,
      availableBalance: user.availableBalance,
      ledgerBalance: user.ledgerBalance,
      stores: storeIds,
    },
    process.env.JWT_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.generateAuthTokenLite = async function () {
  const user = this;
  const stores = await EcommerceStore.find({ user: user._id });
  let storeIds = stores.map((a) => a._id);

  const token = jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      profileTitle: user.profileTitle,
      email: user.email,
      bio: user.bio,
      coverPhoto: user.coverPhoto,
      profilePhoto: user.profilePhoto,
      availableBalance: user.availableBalance,
      ledgerBalance: user.ledgerBalance,
      stores: storeIds,
    },
    process.env.JWT_SECRET
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (req, res, email, password) => {
  //check if user exists
  const user = await User.findOne({ email }).populate("addresses stores");
  if (!user) {
    return res.status(404).send({
      error: "404 not found",
      message: "Email is not registered",
    });
  }

  //compare if the password matches the password for the user
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(404).send({
      error: "404 Credentials not a match",
      message: "Credential is not a match",
    });
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  // user.slug =
  //   "@" +
  //   slugify(user.userName, {
  //     replacement: "_", // replace spaces with replacement character, defaults to `-`
  //     remove: undefined, // remove characters that match regex, defaults to `undefined`
  //     lower: true, // convert to lower case, defaults to `false`
  //     strict: true, // strip special characters except replacement, defaults to `false`
  //     locale: "en", // language code of the locale to use
  //   });
  user.slug = "@" + uniqueSlug(user.userName);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
