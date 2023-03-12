const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");


router.post("/add", async (req, res) => {
  console.log(req.body);
  const { moderator, name } = req.body;
  isRequired = name.length > 0 && moderator.length > 0;

  // check if empty fields
  if (!isRequired) {
    return res.json({ status: "Name,Moderator are required!!" });
  }
  try {
    req.body.joined.push(moderator);      // first joined is moderator
    const newData = new Subgreddit(req.body);
    await newData
      .save()
      .then((data) => res.json(data))
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.send({ status: "Error submitting Subgreddit!" });
  }
});



router.post("/data", async (req, res) => {
  const { moderator } = req.body;
  const MySubgreddits = await Subgreddit.find({ moderator });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgreddits) {
    return res.json({ status: "No Subgreddits found!", moderator });
  }
  //bcrypt + jwt(token)
  if (res.status(201)) {
    return res.json({ status: "mysubgreddits sent", MySubgreddits });
  } else {
    return res.json({ status: "Error: Can't Send Subbgreddits" });
  }
});



router.delete("/delete/:id", async (req, res) => {
  // console.log(req.body);
  await Subgreddit.findByIdAndDelete(req.params.id)
  .then((data) => res.json({ status: "MySubgreddit Deleted Successfully!", data}))
  .catch((error) => console.error("Unable to Delete MySubgreddit!", error));
});


module.exports = router;
