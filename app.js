const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const path = require("path");

const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to BD");
  })
  .catch((err) => {
    console.log("Fail connected to BD");
    console.log(err.message);
  });

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
