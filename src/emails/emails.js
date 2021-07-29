var Mailgen = require("mailgen");
const linkToMonaly = process.env.ORIGIN_URL;
const linktoDashboard = `${linkToMonaly}/dashboard`;
const linktoPricing = `${linkToMonaly}/pricing`;
const linktoInvite = `${linkToMonaly}/invite`;
const linktoOrders = `${linkToMonaly}/orders`;

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "Monaly Inc",
    link: linkToMonaly,
    // Optional product logo
    logo: "https://apply-to-usman.s3.eu-west-2.amazonaws.com/monaly_logo.svg",
    logoHeight: "30px",
  },
});

const monalySignUpEmailBody = (userName, name, isAProUser) => {
  const data = {
    goToAction: {
      text: "Go to Dashboard",
      link: linktoDashboard,
      description: "Get started in your dashboard",
    },
    greeting: "Hi",
    signature: false,
    name: name,
    intro: [
      "Welcome to Monaly! - We’re thrilled to have you here.",
      "Be rest assured you’ve made the right choice by signing up. Monaly helps you keep all your links in one place, easily accessible by your audience. Less stress, no hassle.",
      "As a reminder, your Monaly link is " + linkToMonaly + "/" + userName,
    ],
    action: [
      {
        instructions:
          "Your first step is to add link(s) to your Monaly Page in very easy steps; click on “Add link”, copy the URL, title it. Boom, your first link is set!",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Add a link",
          link: linktoDashboard,
        },
      },
      {
        instructions:
          "The only way to drive traffic is to get your Monaly link out there – everywhere possible. Where your audience is, your Monaly link should be! Copy your Monaly link and share wherever your audience is!",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Copy Link",
          link: linktoDashboard,
        },
      },
    ],
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  };
  if (!isAProUser) {
    data.action.unshift({
      instructions:
        "Check out our PRO plan for access to multiple Monaly accounts, complete analytics, and subscribers information to better understand your audience for just $5 per month.",
      button: {
        color: "#ef476f", // Optional action button color
        text: "Join the Pros",
        link: linktoPricing,
      },
    });
  }
  return data;
};
const data = [
  {
    item: "Event-driven I/O server-side JavaScript environment based on V8.",
    quantity: 2,
    price: "$10.99",
  },
  {
    item:
      "Programmatically create beautiful e-mails using plain old JavaScript.",
    quantity: 3,
    price: "$1.99",
  },
];

const recieptForSeller = (receiptData, name) => {
  const data = {
    goToAction: {
      text: "Go to Dashboard",
      link: linktoDashboard,
      description: "Check order status in Dashboard",
    },
    greeting: "Hi",
    signature: false,
    name: name,
    intro: [
      "An order for your products has been processed succesfully.",
      "Kindly stay in reach of the delivery merchant for product retrieval.,",
      " A good packaging leaves a lasting impression on customers, please pack the good very well.",
      "Delivery merchants will be in contact soon.",
    ],
    table: {
      data: receiptData,
      columns: {
        // Optionally, customize the column widths
        customWidth: {
          quantity: "20%",
          price: "15%",
        },
        // Optionally, change column text alignment
        customAlignment: {
          price: "right",
        },
      },
    },
    action: [
      {
        instructions:
          "You can check the status of your order and more in your dashboard",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Go to Dashboard",
          link: linktoDashboard,
        },
      },
      {
        instructions:
          "Click the 'Dispatched' Button on the Order details page after you handle the package to the delivery merchant",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Order Details",
          link: linktoDashboard,
        },
      },
    ],
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  };
  return data;
};
const reciept = (receiptData, name) => {
  const data = {
    goToAction: {
      text: "Go to Dashboard",
      link: linktoDashboard,
      description: "Check order status in Dashboard",
    },
    greeting: "Hi",
    signature: false,
    name: name,
    intro: ["Your order has been processed succesfully."],
    table: {
      data: receiptData,
      columns: {
        // Optionally, customize the column widths
        customWidth: {
          quantity: "20%",
          price: "15%",
        },
        // Optionally, change column text alignment
        customAlignment: {
          price: "right",
        },
      },
    },
    action: [
      {
        instructions:
          "You can check the status of your order and more in your dashboard",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Go to Dashboard",
          link: linktoDashboard,
        },
      },
    ],
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  };

  return data;
};

const monalyResetPasswordEmailBody = (name, link) => {
  return {
    name: name,
    signature: false,
    intro:
      "You have received this email because a password reset request for your account was received.",
    action: {
      instructions: "Click the button below to reset your password:",
      button: {
        color: "#ef476f",
        text: "Reset your password",
        link: link,
      },
    },
    outro:
      "If you did not request a password reset, no further action is required on your part.",
  };
};

const monaly24HoursViewsAndClickReportEmailBody = (
  name,
  viewsCount,
  clicksCount,
  isAProUser,
  userName
) => {
  const data = {
    goToAction: {
      text: "Go to Dashboard",
      link: linktoDashboard,
      description: "Get started in your dashboard",
    },
    signature: false,
    title: "Hi " + name + "!	Your account is getting attention",
    intro: [
      `You had ${viewsCount} view${
        viewsCount > 0 ? "s" : ""
      } and ${clicksCount} visitor${
        clicksCount > 0 ? "s" : ""
      } visited your links in the last 24 hours.`,
    ],
    action: [],
    outro: [
      `To get traffic to your monaly page, share your monaly link ${linkToMonaly}/${userName} with your audience anywhere they are.`,
      "Need help, or have questions? Just reply to this email, we'd love to help.",
    ],
  };
  if (!isAProUser) {
    data.action.unshift({
      instructions:
        "Try Monaly Pro to get full analytics, customize your monaly page and many more.",
      button: {
        color: "#ef476f", // Optional action button color
        text: "Join the Pros",
        link: linktoPricing,
      },
    });
  }
  return data;
};

const linkCreatedReportEmailBody = (
  name,
  title,
  link,
  isAProUser,
  userName
) => {
  const data = {
    goToAction: {
      text: "Go to Dashboard",
      link: linktoDashboard,
      description: "Get started in your dashboard",
    },
    greeting: "Hi",
    name: name,
    signature: false,
    intro: [
      " Your monaly link you just created has the following details.",
      "	Title : " + title,
      "	Link : " + link,
    ],
    action: [
      {
        instructions: "	You can edit the title and link from your dashboard.",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Edit your link",
          link: linktoDashboard,
        },
      },
      {
        instructions:
          "You can do more with your link, Add image or video to better convey your message,  on your dashboard ",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Your Monaly dashboard.",
          link: linktoDashboard,
        },
      },
      {
        instructions:
          "Try out our pro version to get full analytics, customize your monaly page and many more.",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Join the Pros",
          link: linktoPricing,
        },
      },
    ],
    outro: `To get traffic to your monaly page, share your monaly link ${linkToMonaly}/${userName} with your audience anywhere they are.`,
  };
  if (!isAProUser) {
    data.action.push({
      instructions:
        "Check out our PRO plan for access to multiple Monaly accounts, complete analytics, and subscribers information to better understand your audience for just $5 per month.",
      button: {
        color: "#ef476f", // Optional action button color
        text: "Join the Pros",
        link: linktoPricing,
      },
    });
  }
  return data;
};

const linkViewedReportEmailBody = (title, location, isAProUser, userName) => {
  const data = {
    goToAction: {
      text: "Go to Dashboard",
      link: linktoDashboard,
      description: "Get started in your dashboard",
    },
    title: "“" + title + "” was viewed by a visitor from " + location + ".",

    signature: false,
    intro: ["Your links are getting attention."],
    action: [
      {
        instructions:
          "You can do more with your link, Add image or video to better convey your message,  on your dashboard ",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Your Monaly dashboard.",
          link: linktoDashboard,
        },
      },
    ],
    outro:
      "To get traffic to your monaly page, share your monaly link " +
      linkToMonaly +
      "/" +
      userName +
      " with your audience anywhere they are.",
  };
  if (!isAProUser) {
    data.action.unshift({
      instructions: `To get traffic to your monaly page, share your monaly link ${linkToMonaly}/${userName} with your audience anywhere they are.`,
      button: {
        color: "#ef476f", // Optional action button color
        text: "Join the Pros",
        link: linktoDashboard,
      },
    });
  }
  return data;
};

const moreMonalyCreditsReportEmailBody = (
  friend,
  newCredits,
  totalCredits,
  userName
) => {
  const data = {
    goToAction: {
      text: "Go to Dashboard",
      link: linktoDashboard,
      description: "Get started in your dashboard",
    },
    title: "Your friend " + friend + " just signed up",

    signature: false,
    intro: [
      `Your friend ${friend} just signed up on Monaly and earned you ${newCredits} monaly credits. You now have a total of ${totalCredits} monaly credits.`,
    ],
    action: [
      {
        instructions:
          "	 Invite more friends to get to Monaly Pro for free faster.",
        button: {
          color: "#ef476f", // Optional action button color
          text: "Invite more friends",
          link: linktoInvite,
        },
      },
    ],
    outro: `To get traffic to your monaly page, share your monaly link ${linkToMonaly}/${userName} with your audience anywhere they are.`,
  };
  return data;
};

const generateSignUpEmail = (userName, name, isAProUser) => {
  var signUpEmail = {
    body: monalySignUpEmailBody(userName, name, isAProUser),
  };
  const signUpEmailBody = mailGenerator.generate(signUpEmail);
  return signUpEmailBody;
};
const generateReciept = (data, name) => {
  var receiptEmail = {
    body: reciept(data, name),
  };
  const receiptEmailBody = mailGenerator.generate(receiptEmail);
  return receiptEmailBody;
};
const generateRecieptForSeller = (data, name) => {
  var receiptEmail = {
    body: recieptForSeller(data, name),
  };
  const receiptEmailBody = mailGenerator.generate(receiptEmail);
  return receiptEmailBody;
};
const generateRecurringEmail = (
  name,
  viewsCount,
  clicksCount,
  isAProUser,
  userName
) => {
  var email = {
    body: monaly24HoursViewsAndClickReportEmailBody(
      name,
      viewsCount,
      clicksCount,
      isAProUser,
      userName
    ),
  };
  const generated = mailGenerator.generate(email);
  return generated;
};

var newEmail = {
  body: recieptForSeller(data, "Usman Ayobami"),
};

// Generate an HTML email with the provided contents

// Generate the plaintext version of the e-mail (for clients that do not support HTML)
// var emailText = mailGenerator.generatePlaintext(signUpEmail);
var emailHTML = mailGenerator.generate(newEmail);

// Optionally, preview the generated HTML e-mail by writing it to a local file
require("fs").writeFileSync("preview.html", emailHTML, "utf8");

module.exports = {
  generateSignUpEmail,
  generateRecurringEmail,
  generateReciept,
  generateRecieptForSeller,
};
// export { generateSignUpEmail };
