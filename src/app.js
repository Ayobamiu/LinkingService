//import
const express = require("express");
const userRoute = require("./routers/users.route");
const productRoute = require("./routers/products.route");
const artistRoute = require("./routers/artist.route");
const digitalPlatformRoute = require("./routers/digitalPlatform.route");
const socialMediaPlatformRoute = require("./routers/socialMedia.route");
const promotionPlatformRoute = require("./routers/promotion.route");
require("./db/mongoose");
//create express App

const app = express();
app.use(express.urlencoded());
app.use(express.json());

app.use("/products", productRoute);
app.use("/auth", userRoute);
app.use("/platforms", digitalPlatformRoute);
app.use("/socials", socialMediaPlatformRoute);
app.use("/artists", artistRoute);
app.use("/promotions", promotionPlatformRoute);

//tell express to pass incoming request body and send to us in json format
// app.use(express.json());

module.exports = app;
