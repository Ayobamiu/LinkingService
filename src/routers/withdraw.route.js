const express = require("express");
const WithdrawalController = require("../controllers/withdrawal.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, WithdrawalController.withdrawToOwnAccount);

module.exports = router;
