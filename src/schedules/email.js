const schedule = require("node-schedule");
const UserView = require("../models/artistViews.model");
const CustomLinkClick = require("../models/customLinkClick.model");
const User = require("../models/users.model");
const moment = require("moment");

const messageAllUser = async () => {
  const users = await User.find({});
  const today = new Date();
  const yesterday = moment().subtract(1, "day").toDate();
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    const clickCount = await CustomLinkClick.countDocuments({
      user: user._id,
      createdAt: { $gte: yesterday, $lte: today },
    });
    const viewCount = await UserView.countDocuments({
      user: user._id,
      createdAt: { $gte: yesterday, $lte: today },
    });
    console.log(user.userName, clickCount, viewCount);
  }
};

// console.log(today);
// console.log(yesterday);

// messageAllUser();
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 17;
rule.minute = 0;

const job = schedule.scheduleJob("* * * * * *", function () {
  messageAllUser();
});

job.emit();
job.cancel();

module.exports = job;
