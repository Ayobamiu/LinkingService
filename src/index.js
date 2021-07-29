const app = require("./app");

//App listen to a port
app.listen(process.env.PORT || 3003, () => {
  console.log("Server is up and running at Port " + process.env.PORT);
});
