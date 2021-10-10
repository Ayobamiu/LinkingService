const schedule = require("node-schedule");
const UserView = require("../models/artistViews.model");
const CustomLinkClick = require("../models/customLinkClick.model");
const User = require("../models/users.model");
const moment = require("moment");
const { sendRecurringDailyEmail } = require("../emails/account");
const sgMail = require("@sendgrid/mail");

const fromEmail = "contact@monaly.co";
const fromname = "Monaly";

var CronJob = require("cron").CronJob;

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
    sendRecurringDailyEmail(
      user.email,
      user.firstName,
      user.userName,
      false,
      viewCount,
      clickCount
    );
    // console.log(user.userName, clickCount, viewCount);
  }
};

// console.log(today);
// console.log(yesterday);

// messageAllUser();
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 21;
rule.minute = 0;

const job = schedule.scheduleJob(rule, function () {
  messageAllUser();
});

// job.emit();
// job.cancel();

var cronJob = new CronJob(
  "5 8 * * 0",
  async function () {
    const users = await User.find({}).populate(
      "linksCount productsCount storesCount"
    );
    const today = new Date();
    const yesterday = moment().subtract(7, "days").toDate();
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
      if (user.linksCount === 0) {
        sgMail
          .send({
            to: "ayobamiu@gmail.com",
            from: {
              email: fromEmail,
              name: fromname,
            },

            subject: "About your Monaly Link.",

            html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email</title>
      </head>
      <body>
        <p>Hey ${user.firstName},</p>
    
        <p>
          Just wanted to check in because it seems like you're currently not using
          your Monaly link:
          <a href="https://www.monaly.co/${user.userName}">monaly.co/${user.userName}</a>.
        </p>
    
        <p>Would you mind responding to this email and letting me know why?</p>
    
        <p>
          Just trying to make sure we're building the best product possible for you!
        </p>
    
        <p>Usman</p>
    
        <p>Co-founder</p>
    
        <p>Monaly</p>
    
        <small
          >p.s. I'll try to only send helpful emails, but just
          <a href="mailto:usman@monaly.co">let me know</a> if you don't want to get
          these. Even though this email is automated. I read every single response.
          :)</small
        >
      </body>
    </html>
    `,
          })
          .then((response) => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        sendRecurringDailyEmail(
          user.email,
          user.firstName,
          user.userName,
          false,
          viewCount,
          clickCount
        );
      }
      // console.log(user.userName, clickCount, viewCount);
    }
  },
  null,
  true,
  "Africa/Lagos"
);
cronJob.start();

module.exports = job;
