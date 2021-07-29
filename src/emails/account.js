const sgMail = require("@sendgrid/mail");
const {
  generateSignUpEmail,
  generateRecurringEmail,
  generateReciept,
  generateRecieptForSeller,
} = require("./emails");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

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
      from: "monalyinc@gmail.com",
      subject: "Your Account is getting Attention",
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
      from: "monalyinc@gmail.com",
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
const sendRecieptBuyer = (email, data, name) => {
  sgMail
    .send({
      to: email,
      from: "monalyinc@gmail.com",
      subject: "Your Order is Successful.",
      text: `Your Order is Successful.`,
      html: generateReciept(data, name),
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
      from: "monalyinc@gmail.com",
      subject: "An Order was completed.",
      text: `An Order was completed.`,
      html: generateReciept(data, name),
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
    from: "usman.ayobami.g20@gmail.com",
    subject: `${name}, we will miss you.`,
    text: `We'll miss you ${name}. We wish we could keep you here longer.`,
  });
};

const sendNewPromotionEmail = (email, name, newPromotion) => {
  sgMail.send({
    to: email,
    from: "usman.ayobami.g20@gmail.com",
    subject: `${newPromotion.user} added a new ${newPromotion.type}`,
    text: `${newPromotion.name} just added a new ${newPromotion.type}. Check it out here ${newPromotion.link}`,
    html: `<p>${newPromotion.name} just added a new ${newPromotion.type}. Check it out here <a href=${newPromotion.link}>here</a></p>`,
  });
};

const resetPasswordMessage = (email, token) => {
  const msg = {
    to: email,
    from: "usman.ayobami.g20@gmail.com", // Use the email address or domain you verified above
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
};
