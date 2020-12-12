const app = require("./app");

//App listen to a port
app.listen(process.env.PORT, () => {
  console.log("Server is up and running at Port " + process.env.PORT);
});
