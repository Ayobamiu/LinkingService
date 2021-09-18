//import
const express = require("express");
const cors = require("cors");
const authRoute = require("./routers/auth.route");
const userRoute = require("./routers/users.route");
const productRoute = require("./routers/products.route");
const artistRoute = require("./routers/artist.route");
const digitalPlatformRoute = require("./routers/digitalPlatform.route");
const socialMediaPlatformRoute = require("./routers/socialMedia.route");
const promotionPlatformRoute = require("./routers/promotion.route");
const customLinkRoute = require("./routers/customLink.route");
const themeRoute = require("./routers/theme.route");
const notificationRoute = require("./routers/notification.route");
const subscriptionRoute = require("./routers/subscriptions.route");
const storeRoute = require("./routers/store.route");
const withdrawRoute = require("./routers/withdraw.route");
const Order = require("./models/order.model");
require("./db/mongoose");
require("./schedules/email");
//create express App

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.use("/subscriptions", subscriptionRoute);
app.use("/notifications", notificationRoute);
app.use("/themes", themeRoute);
app.use("/products", productRoute);
app.use("/auth", userRoute);
app.use("/auth-lite", authRoute);
app.use("/platforms", digitalPlatformRoute);
app.use("/socials", socialMediaPlatformRoute);
app.use("/users", artistRoute);
app.use("/store", storeRoute);
app.use("/promotions", promotionPlatformRoute);
app.use("/custom-links", customLinkRoute);
app.use("/withdraw", withdrawRoute);

module.exports = app;
