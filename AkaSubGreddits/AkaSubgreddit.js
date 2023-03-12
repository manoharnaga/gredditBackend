const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");

router.get("/dataall", async (req, res) => {
  const AkaSubgreddits = await Subgreddit.find();
  if (!AkaSubgreddits) {
    return res.json({ status: "No Subgreddits found!" });
  }

  if (res.status(201)) {
    // All Tags
    let Tags = [];
    AkaSubgreddits?.map((subgreddit) => (
      subgreddit?.tags?.map((tag) => (
        !(Tags.includes(tag)) ? Tags.push(tag):null
      ))
    ))
    // console.log(Tags);
    // All Tags
    return res.json({
      status: "AKAsubgredditUsers sent",
      AkaSubgreddits: AkaSubgreddits,
      Tags: Tags
    });
  } else {
    return res.json({ status: "Error: Can't Send AkaSubbgreddits" });
  }
});

router.put("/joinreq", async (req, res) => {
  const { id, userId, isJoinOrLeave } = req.body;
  // userId ====> username of user
  const AkaSubgreddit = await Subgreddit.findOne({ _id: id });
  if (!AkaSubgreddit) {
    return res.json({ status: "No Subgreddits found!" });
  }

  try {
    if(isJoinOrLeave === 1){
      if(AkaSubgreddit.leftsub.includes(userId)){
        return res.json({ status: "Already left Subgreddit before!" });
      }
      else{
        AkaSubgreddit.requested.push(userId);
        console.log("JoinRequestSent!", AkaSubgreddit);
      }
    }
    else if(isJoinOrLeave === 2){
      AkaSubgreddit.joined = AkaSubgreddit.joined.filter((joinedUser) => {
        return joinedUser !== userId;
      })
      AkaSubgreddit.leftsub.push(userId);
    }
    await AkaSubgreddit.save()
      .then( async (data) => {
          const AkaSubgreddits = await Subgreddit.find();
          res.json({
            status: "Join/Leave Request sent Successfully!",
            AkaSubgreddits: AkaSubgreddits,
            SubgredditData:data
          })
        }
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error Sending Joining Request!" });
  }
});




// Aka Subgreddit One

router.post("/data", async (req, res) => {
  const { id } = req.body;
  const AkaSubgredditPost = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!AkaSubgredditPost) {
    return res.json({ status: "No AkaSubgredditPost found!", id });
  }
  if (res.status(201)) {
    return res.json({
      status: "AkasubgredditPost sent",
      AkaSubgredditPost,
    });
  } else {
    return res.json({ status: "Error: Can't Send AkaSubbgredditPost" });
  }
});

router.put("/addpost", async (req, res) => {
  const { postedBy, postedIn, Text } = req.body;
  const AkaSubgreddit = await Subgreddit.findOne({ _id: postedIn });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!AkaSubgreddit) {
    return res.json({ status: "No AkaSubgreddit found!", postedBy });
  }

  try {
    AkaSubgreddit.post.push({
      id: AkaSubgreddit.post.length,
      postedBy: postedBy,
      postedIn: postedIn,
      Text: Text,
      upvotes: [],
      downvotes: [],
      comments: [],
      savedby: [],
      report: []
    });

    console.log("From Backend Post!", AkaSubgreddit);

    await AkaSubgreddit.save()
      .then((data) =>
        res.json({
          status: "Post Created Successfully!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error Creating Post!" });
  }
});


router.put("/reportpost", async (req, res) => {
  const { 
    postobj_id,
    postedIn,
    postid,
    reportedBy,
    reportedVictim,
    concern,
    Text,
    CreateTimeInms } = req.body;
  const AkaSubgreddit = await Subgreddit.findOne({ _id: postedIn });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!AkaSubgreddit) {
    return res.json({ status: "No AkaSubgreddit found!", postedBy });
  }

  try {
    AkaSubgreddit.post[postid].report.push({
      postobj_id: postobj_id,
      postid: postid,
      reportedBy: reportedBy,
      reportedVictim: reportedVictim,
      concern: concern,
      Text: Text,
      CreateTimeInms: CreateTimeInms
    })

    // console.log("ds",AkaSubgreddit.post[postid]);
    console.log("From Backend Reportxyz!", AkaSubgreddit.post[postid]);

    await AkaSubgreddit.save()
      .then((data) =>
        res.json({
          status: "Report Sent Successfully!",
          SubgredditData: data
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error Creating Report!" });
  }
});

// Aka Subgreddit One - Posts

router.put("/updatepost", async (req, res) => {
  const { id, postid, upvotesid, downvotesid, comment } = req.body;
  const AkaSubgreddit = await Subgreddit.findOne({ _id: id });
  // check if any Subgreddit exists -- empty fields are also handled
  if (!AkaSubgreddit) {
    return res.json({ status: "No AkaSubgreddit found!", UpdatePost });
  }

  try {
    if (upvotesid !== "-1") {
      if (AkaSubgreddit.post[postid].upvotes.includes(upvotesid)) {
        AkaSubgreddit.post[postid].upvotes = AkaSubgreddit.post[
          postid
        ].upvotes.filter((upvoteid) => {
          return upvoteid !== upvotesid;
        });
      } else {
        // remove the user from downvotes if he is trying to upvote
        if (AkaSubgreddit.post[postid].downvotes.includes(upvotesid)) {
          AkaSubgreddit.post[postid].downvotes = AkaSubgreddit.post[
            postid
          ].downvotes.filter((downvoteid) => {
            return downvoteid !== upvotesid;
          });
        }
        AkaSubgreddit.post[postid].upvotes.push(upvotesid);
      }
    } else if (downvotesid !== "-1") {
      if (AkaSubgreddit.post[postid].downvotes.includes(downvotesid)) {
        AkaSubgreddit.post[postid].downvotes = AkaSubgreddit.post[
          postid
        ].downvotes.filter((downvoteid) => {
          return downvoteid !== downvotesid;
        });
      } else {
        if (AkaSubgreddit.post[postid].upvotes.includes(downvotesid)) {
          AkaSubgreddit.post[postid].upvotes = AkaSubgreddit.post[
            postid
          ].upvotes.filter((upvoteid) => {
            return upvoteid !== downvotesid;
          });
        }
        AkaSubgreddit.post[postid].downvotes.push(downvotesid);
      }
    } else if (comment !== "-1") {
      AkaSubgreddit.post[postid].comments.push(comment.comment);
    }

    console.log("From Backend Updated Post!", AkaSubgreddit.post[postid].comments);

    await AkaSubgreddit.save()
      .then((data) =>
        res.json({
          status: "Post Updated Successfully!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error Updating Post!" });
  }
});

// Aka Subgreddit One - Posts - FollowBtn

const db = require("../models/User");

router.put("/follow", async (req, res) => {
  const { username, followerUsername } = req.body;
  const user = await db.findOne({ username: username });
  const followUser = await db.findOne({ username: followerUsername });
  if (!user || !followUser) {
    return res.json({ status: "User Doesn't Exist!-followers", username });
  }
  try {
    // add followUser to followers[] of user - higher
    // add User to following[] of followUser - lower
    if (
      user.followers.includes(followerUsername) ||
      followUser.following.includes(username)
    ) {
      return res.json({ status: "Already Following!", username });
    } else {
      user.followers.push(followerUsername);
      followUser.following.push(username);
    }
    console.log(username);
    let firstResponse = {};
    await followUser
      .save()
      .then((data) => (firstResponse = data))
      .catch((error) => console.error("Error:", error));
    await user
      .save()
      .then((data) =>
        res.json({
          status: "both recieved - from AkaSubGreddit",
          firstResponse,
          data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error updating followers list!" });
  }
});

module.exports = router;
