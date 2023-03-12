const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");
// moderator -- mod --> subgreddits

router.post("/data", async (req, res) => {
  const { id } = req.body;
  const MySubgreddit = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgreddit) {
    return res.json({ status: "No Subgreddit found!", moderator });
  }
  //bcrypt + jwt(token)

  if (res.status(201)) {
    return res.json({
      status: "modsubgredditUsers sent",
      MySubgreddit,
    });
  } else {
    return res.json({ status: "Error: Can't Send ModSubbgredditUsers" });
  }
});

router.put("/request", async (req, res) => {
  const { id, username, flagRequest } = req.body;
  const MySubgredditMod = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgredditMod) {
    return res.json({ status: "No Subgreddits found!", moderator });
  }
  try {
    MySubgredditMod.requested = MySubgredditMod.requested.filter((user) => {
      return user !== username;
    });
    if (flagRequest === 1) {
      MySubgredditMod.joined.push(username);
    }

    await MySubgredditMod.save()
      .then((data) =>
        res.json({
          status: "joiningRequest Successfull!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error updating Joining Requests list!" });
  }
});


router.put("/delpost", async (req, res) => {
  const { subid, postid,postobjid, reportid } = req.body;
  const MySubgredditMod = await Subgreddit.findOne({ _id: subid });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgredditMod) {
    return res.json({ status: "No Subgreddits found!", subid });
  }
  try {
    
    // We are storing the report in post itself 
    // thus when the post is deleted the report 
    // Automatically gets deleted
    
    MySubgredditMod.post = MySubgredditMod.post.filter((postobj) => {
      return postobj._id != postobjid;
    })
    // console.log(MySubgredditMod.post);

    await MySubgredditMod.save()
      .then((data) =>
        res.json({
          status: "Post Deleted by moderator Successfull!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error deleting reported post!" });
  }
});



router.put("/blockuser", async (req, res) => {
  const { subid, postid,reportedVictim } = req.body;
  const MySubgredditMod = await Subgreddit.findOne({ _id: subid });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgredditMod) {
    return res.json({ status: "No Subgreddits found!", subid });
  }
  try {
    

    // if(MySubgredditMod.joined.includes(reportedVictim)){
    //   MySubgredditMod.joined = MySubgredditMod.joined.filter((joinedUser) => {
    //     return joinedUser !== reportedVictim;
    //   })
    // }

    if(!MySubgredditMod.blocked.includes(reportedVictim)){
      MySubgredditMod.blocked.push(reportedVictim);
      MySubgredditMod.post[postid].postedBy = "Blocked User";
    }

    await MySubgredditMod.save()
      .then((data) =>
        res.json({
          status: "reportedUser block Successfull!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error blocking reported User!" });
  }
});


router.put("/deltimedoutreports", async (req, res) => {
  const { subid,curTimeInms } = req.body;
  const MySubgredditMod = await Subgreddit.findOne({ _id: subid });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!MySubgredditMod) {
    return res.json({ status: "No Subgreddits found!", subid });
  }
  try {
    const TimedOut = 1000000; // 1000 seconds
    
    MySubgredditMod.post.map((postobj) => {
      postobj.report.map((reportobj) => {
        if((curTimeInms - reportobj.CreateTimeInms) >= TimedOut){
          // console.log(curTimeInms - reportobj.CreateTimeInms);
          MySubgredditMod.post[postobj.id].report 
            = MySubgredditMod.post[postobj.id].report.filter((reportobj2) => {
              return reportobj2._id !== reportobj._id
          })
        }
      })
    })

    await MySubgredditMod.save()
      .then((data) =>
        res.json({
          status: "deleteTimedOutReports Successfull!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error deleting timedout reports!" });
  }
});

module.exports = router;
