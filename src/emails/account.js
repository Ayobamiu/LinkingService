/** @format */

const sgMail = require("@sendgrid/mail");
const {
  generateSignUpEmail,
  generateRecurringEmail,
  generateReciept,
  generateRecieptForSeller,
} = require("./emails");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const fromEmail = "contact@monaly.co";
const fromname = "Monaly";

const sendWaitingListEmail = (email) => {
  sgMail
    .send({
      to: email,
      from: {
        email: fromEmail,
        name: fromname,
      },

      subject: "Monaly is launching soon 🚀 ",
      html: `<div>
              <p>
                🤗 We are happy to have you.
              </p>
              
              <p>
                Thank you for joining our waiting list.
              </p>
              
              <p>
                We will be sure to tell 🤙 you first once we launch.
              </p>
      </div>
      `,
    })
    .then((response) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
const sendRecurringDailyEmail = (
  email,
  name,
  userName,
  isAProUser = false,
  viewsCount,
  clicksCount
) => {
  sgMail
    .send({
      to: email,
      from: {
        email: fromEmail,
        name: fromname,
      },

      subject: "Your Weekly Report is Available",
      text: `${name}, Your Account is getting Attention.`,
      html: generateRecurringEmail(
        name,
        viewsCount,
        clicksCount,
        isAProUser,
        userName
      ),
    })
    .then((response) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
const sendWelcomeEmail = (email, name, userName, isAProUser = false) => {
  sgMail
    .send({
      to: email,
      from: {
        email: fromEmail,
        name: fromname,
      },

      subject: "Thanks for coming!!",
      text: `Welcome to Monaly ${name}.`,
      html: generateSignUpEmail(userName, name, isAProUser),
    })
    .then((response) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
const sendRecieptBuyer = (email, data, name, docum) => {
  sgMail
    .send({
      to: email,
      from: {
        email: fromEmail,
        name: fromname,
      },
      subject: "Your Order is Successful.",
      text: `Your Order is Successful.`,
      html: generateReciept(data, name, docum),
    })
    .then((response) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
const sendRecieptSeller = (email, data, name) => {
  sgMail
    .send({
      to: email,
      from: {
        email: fromEmail,
        name: fromname,
      },

      subject: "An Order was completed.",
      text: `An Order was completed.`,
      html: generateRecieptForSeller(data, name),
    })
    .then((response) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

// sendWelcomeEmail("ayobamiu@gmail.com", "Usman");
const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: {
      email: fromEmail,
      name: fromname,
    },
    subject: `${name}, we will miss you.`,
    text: `We'll miss you ${name}. We wish we could keep you here longer.`,
  });
};

const sendNewPromotionEmail = (email, name, newPromotion) => {
  sgMail.send({
    to: email,
    from: {
      email: fromEmail,
      name: fromname,
    },
    subject: `${newPromotion.user} added a new ${newPromotion.type}`,
    text: `${newPromotion.name} just added a new ${newPromotion.type}. Check it out here ${newPromotion.link}`,
    html: `<p>${newPromotion.name} just added a new ${newPromotion.type}. Check it out here <a href=${newPromotion.link}>here</a></p>`,
  });
};

const resetPasswordMessage = (email, token) => {
  const msg = {
    to: email,
    from: {
      email: fromEmail,
      name: fromname,
    },
    subject: "Reset Password",
    text: `Click the followiing link to reset password  ${process.env.ORIGIN_URL}/reset-password/${token}. This link expires in 1 hour.`,
  };

  sgMail.send(msg);
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
  resetPasswordMessage,
  sendRecurringDailyEmail,
  sendRecieptBuyer,
  sendRecieptSeller,
  sendWaitingListEmail,
};
