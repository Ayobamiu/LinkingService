const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const { sendPushNotification } = require("../utilities/pushNotifications");
const BankRecord = require("../models/bankRecord.model");

function getRandomString(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

class AuthController {
  static async signUpLite(req, res) {
    try {
      const userNameExists = await User.findOne({
        userName: req.body.userName,
      });
      if (userNameExists) {
        return res.status(400).send({
          error: "400 Bad request",
          message: "userName is taken",
        });
      }

      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).send({
          error: "400 Bad request",
          message: "Email is taken",
        });
      }

      const user = new User({
        ...req.body,
        userName: req.body.userName.replace(/\s/g, ""),
      });
      const token = await user.generateAuthTokenLite();
      await user.save();
      sendWelcomeEmail(user.email, user.firstName, user.userName, false);
      res.status(201).send(token);
    } catch (error) {
      res.status(500).send({
        error: "500 Internal server error",
        message: "Error saving User",
      });
    }
  }
  static async loginLite(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send({
          error: "404 not found",
          message: "Email is not registered",
        });
      }

      //compare if the password matches the password for the user
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(205).send({
          error: "205 Credentials not a match",
          message: "Credential is not a match",
        });
      }

      const token = await user.generateAuthTokenLite();
      console.log("token", token);
      res.send(token);
    } catch (error) {
      console.log("error", error);
      res
        .status(400)
        .send({ error: "400 Bad request", message: "Unable to login" });
    }
  }

  static async checkUserName(req, res) {
    try {
      const userNameExists = await User.findOne({
        userName: req.body.userName,
      });

      if (userNameExists) {
        return res.status(400).send({
          error: "400 Bad request",
          message: "Username taken.",
        });
      }
      if (!userNameExists) {
        return res.status(200).send({
          message: "Username available!",
        });
      }
    } catch (error) {
      res.status(500).send({
        error: "500 Internal server error",
        message: "Error saving User",
      });
    }
  }

  static async addExpoPushToken(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          expoPushToken: req.body.expoPushToken,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).send({
          error: "404 not found",
          message: "User not found.",
        });
      }
      console.log("User registered fro push notification", {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        expoPushToken: user.expoPushToken,
      });
      res.send({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        expoPushToken: user.expoPushToken,
      });
    } catch (error) {
      res.status(500).send({
        error: "500 Internal server error",
        message: "Error updating User",
      });
    }
  }

  static async sendNotification(req, res) {
    try {
      const user = await User.findById(req.user._id);
      console.log("expoPushToken", user);

      await sendPushNotification(
        user.expoPushToken,
        "How is the Monaly experience?"
      );
      console.log("success");
      res.send("success");
    } catch (error) {
      console.log("error", error);
    }
  }

  static async addBankRecord(req, res) {
    console.log("req.body", req.body);
    try {
      const record = await BankRecord.create({
        user: req.user._id,
        ...req.body,
      });

      res.send(record);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  static async getBankRecords(req, res) {
    try {
      const records = await BankRecord.find({
        user: req.user._id,
      });

      return res.send(records);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
module.exports = AuthController;
