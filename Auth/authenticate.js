const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models/User");
const generateToken = require("./jwt/generateToken");
const verifyToken = require("./jwt/verifyToken");

router.post("/register", async (req, res) => {
  const { fname, lname, username, emailid, age, phno, password } = req.body;
  isRequired = fname.length > 0 && lname.length > 0 && username.length > 0 && emailid.length > 0 && age.length > 0 && phno.length > 0 && password.length > 0;

  // check if empty fields
  if (!isRequired) {
    return res.json({ status: "All Fields are required!!" });
  }
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
      req.body.profilepic = process.env.DEFAULT_PROFILE_PIC;
      const newData = new db(req.body);
      await newData
        .save()
        .then((data) => res.json(data))
        .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.json({ status: "Error submitting new UserRegistration!" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.findOne({ username: username });
  // check if user exists -- empty fields are also handled
  if (!user) {
    return res.status(404).json({ username });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ username });
  }
  const token = await generateToken(username);
  return res.status(200).json({ user,token });
});

router.post("/loginstore", verifyToken, async (req, res) => {
  const { username } = req.user;
  // let newToken = null;
  // if(req.isNewToken){
  //   newToken = req.headers.authorization?.split(' ')[1];
  // }
  if(req.isExpired){
    // console.log("Token Expired");
    return res.status(401).json({ username });
  }
  const user = await db.findOne({ username: username });
  // check if user exists -- empty fields are also handled
  if (!user) {
    return res.status(404).json({ username });
  }
  return res.status(200).json({user});
});

router.get("/getallusernames", async (req, res) => {
  const users = await db.find({});
  let usernames = [];
  let emails = [];
  if (!users) {
    return res.status(404).json({ usernames });
  }
  for (let i = 0; i < users.length; i++) {
    usernames.push(users[i].username);
    emails.push(users[i].emailid);
  }
  if (usernames.length === 0) {
    return res.status(404).json({ usernames });
  }
  return res.status(200).json({ usernames, emails });
});

router.post("/altlogin", async (req, res) => {
  const { altType, userinfo } = req.body;
  let user = null;
  if (altType === "google") {
    user = await db.findOne({ emailid: userinfo });
  } else if (altType === "phno") {
    user = await db.findOne({ phno: userinfo });
  } else if (altType === "facebook") {
    // user = await db.findOne({ emailid: userinfo });
  }

  if (!user) {
    return res.status(404).json({ userinfo });
  }
  const token = await generateToken(user.username);
  return res.status(200).json({ user,token });
});

router.post("/altregister", async (req, res) => {
  const { username, emailid, phno } = req.body;
  // check if empty fields
  if (!(username.length > 0 && (emailid.length > 0 || phno.length > 0))) {
    return res.json({ status: "All Fields are required!!" });
  }
  try {
    req.body.profilepic = process.env.DEFAULT_PROFILE_PIC;
    const newData = new db(req.body);
    await newData
      .save()
      .then((data) => res.json(data))
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.json({ status: "Error submitting new AltUserRegistration!" });
  }
});
module.exports = router;
