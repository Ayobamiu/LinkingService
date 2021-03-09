const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(
  "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"
);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "usman.ayobami.g20@gmail.com",
    subject: "Thanks for coming!!",
    text: `Welcome to Monaly ${name}.`,
  });
};

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
};
