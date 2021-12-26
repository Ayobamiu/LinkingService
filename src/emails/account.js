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
const sendLaunchEmail = (email) => {
  sgMail
    .send({
      to: email,
      from: {
        email: fromEmail,
        name: fromname,
      },

      subject: "Monaly launch 🚀",
      html: `<div>
      <p><span data-preserver-spaces="true">Welcome to monaly</span></p>
      <p><span data-preserver-spaces="true">We launch 🚀 today and we are very excited to start the journey with you.</span></p>
      <p>&nbsp;</p>
      <p><span data-preserver-spaces="true">Monaly lets you host links to a variety of media content on your personal webpage with easy-to-use customization options.</span></p>
      <p>&nbsp;</p>
      <p><span data-preserver-spaces="true">Monaly is for everyone and anyone that wants to showcase their works. From companies, writers, entrepreneurs, artists, to students.</span></p>
      <p><span data-preserver-spaces="true">How do I set up my Monaly?</span></p>
      <p><span data-preserver-spaces="true">1. Sign up with Monaly&nbsp;</span><a class="editor-rtfLink" href="https://www.monaly.com" target="_blank" rel="noopener"><span data-preserver-spaces="true">here&nbsp;</span></a></p>
      <p><span data-preserver-spaces="true">2. Go to dashboard</span></p>
      <p><span data-preserver-spaces="true">3. Click on the &ldquo;Add new link&rdquo; button</span></p>
      <p><span data-preserver-spaces="true">4. Add a link title e.g My new store</span></p>
      <p><span data-preserver-spaces="true">5. Add a link URL e.g https://www.mynewstore.com</span></p>
      <p><span data-preserver-spaces="true">6. Add an image to your link (optional)</span></p>
      <p><span data-preserver-spaces="true">7. Click on Add.</span></p>
      <p><span data-preserver-spaces="true">I have added a link, what&rsquo;s next?</span></p>
      <p><span data-preserver-spaces="true">To add a link is the first and hardest part of using Monaly, now let the whole world 🌎 know.</span></p>
      <p><span data-preserver-spaces="true">Share your link with your audience on all platforms.&nbsp;</span></p>
      <p><span data-preserver-spaces="true">Click on the &ldquo;Copy link&rdquo; button to share your Monaly link with friends.</span></p>
      </div>
      `,
    })
    .then((response) => {
      console.log("Launch Email sent");
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
// sendLaunchEmail([
//   "oluwapelumi.fashola@gmail.com",
//   "emmanueloyekan33@gmail.com",
//   "ifebrand6@gmail.com",
//   "moshoodbasith46@gmail.com",
//   "oluwanifemiobafemi@gmail.com",
//   "salako956@gmail.com",
//   "ogebunmigrace@gmail.com",
//   "barseetbrown@gmail.com",
//   "samuelotunla16@gmail.com",
// ]);

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
  resetPasswordMessage,
  sendRecurringDailyEmail,
  sendRecieptBuyer,
  sendRecieptSeller,
  sendWaitingListEmail,
};
