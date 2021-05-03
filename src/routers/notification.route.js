const express = require("express");
const upload = require("../bucket-config/bucket");
const NotificationsController = require("../controllers/notifications.controller");

const router = express.Router();

router.get("/", NotificationsController.getNotifications);
router.post(
  "/",
  upload.single("image"),
  NotificationsController.addNotification
);

module.exports = router;
