const express = require("express");
const SubscriptionsController = require("../controllers/subscriptions.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", auth, SubscriptionsController.getSubscription);
router.post("/", auth, SubscriptionsController.addSubscription);

module.exports = router;
