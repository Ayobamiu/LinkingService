//import
const express = require("express");
//create express App
const app = express();

//tell express to pass incoming request body and send to us in json format
app.use(express.json());

//App listen to a port
app.listen(3001, () => {
  console.log("Server is up and running at Port 3001");
});
