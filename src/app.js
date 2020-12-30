//import
const express = require("express");
const userRouter = require("./routers/users.route");
const productRouter = require("./routers/products.route");
const artistRoute = require("./routers/artist.route");
const digitalPlatformRoute = require("./routers/digitalPlatform.route");
const socialMediaPlatformRoute = require("./routers/socialMedia.route");
require("./db/mongoose");
//create express App

const app = express();
app.use(express.urlencoded());
app.use(express.json());

app.use("/products", productRouter);
app.use("/auth", userRouter);
app.use("/platforms", digitalPlatformRoute);
app.use("/socials", socialMediaPlatformRoute);
app.use("/artists", artistRoute);

//tell express to pass incoming request body and send to us in json format
// app.use(express.json());

module.exports = app;
