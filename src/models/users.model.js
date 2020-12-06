const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    stageName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    viewCount: {
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
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "myjwtsecretkey");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  //check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  //compare if the password matches the password for the user
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
