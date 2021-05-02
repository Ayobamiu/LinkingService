//import
const express = require("express");
const cors = require("cors");
const userRoute = require("./routers/users.route");
const productRoute = require("./routers/products.route");
const artistRoute = require("./routers/artist.route");
const digitalPlatformRoute = require("./routers/digitalPlatform.route");
const socialMediaPlatformRoute = require("./routers/socialMedia.route");
const promotionPlatformRoute = require("./routers/promotion.route");
const customLinkRoute = require("./routers/customLink.route");
const themeRoute = require("./routers/theme.route");
const Order = require("./models/order.model");
require("./db/mongoose");
require("./schedules/email");
//create express App

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.use("/themes", themeRoute);
app.use("/products", productRoute);
app.use("/auth", userRoute);
app.use("/platforms", digitalPlatformRoute);
app.use("/socials", socialMediaPlatformRoute);
app.use("/users", artistRoute);
app.use("/promotions", promotionPlatformRoute);
app.use("/custom-links", customLinkRoute);

module.exports = app;
