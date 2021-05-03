const mongoose = require("mongoose");

const NotificationsSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    image: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);
const Notifications = mongoose.model("Notifications", NotificationsSchema);

module.exports = Notifications;
