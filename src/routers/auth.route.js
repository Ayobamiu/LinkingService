/** @format */

const express = require("express");
const AuthController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add-to-waiting-list", AuthController.addUserToWaitingList);
router.post("/add-bank", auth, AuthController.addBankRecord);
router.get("/banks", auth, AuthController.getBankRecords);
router.post("/send-notification", auth, AuthController.sendNotification);
router.post("/expoPushToken", auth, AuthController.addExpoPushToken);
router.post("/login", AuthController.loginLite);
router.post("/check", AuthController.checkUserName);
router.post("/suggestions", AuthController.checkUserNameSuggestions);
router.post("/", AuthController.signUpLite);

module.exports = router;
