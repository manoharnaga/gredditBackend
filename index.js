const express = require("express");
const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();


//app
const app = express();
// db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"));

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("users");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};

//middlewares
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use(express.static(path.join(__dirname, "/build")));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/auth", require("./Auth/auth"));
app.use("/api/profile", require("./Profile/editprofile"));
app.use("/api/mysubgreddits", require("./MySubGreddit/mySubGreddit"));
app.use("/api/mysubgredditsmod", require("./SubGredditMod/SubGredditMod"));
app.use("/api/akasubgreddits", require("./AkaSubGreddits/AkaSubgreddit"));
app.use("/api/savedpost", require("./Savedpost/Savedpost"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/"));
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
