//import
const express = require("express");
const userRouter = require("./routers/users.route");
require("./db/mongoose");
//create express App
const app = express();
app.use(express.json());

app.use("/auth", userRouter);

//tell express to pass incoming request body and send to us in json format
app.use(express.json());

module.exports = app;
