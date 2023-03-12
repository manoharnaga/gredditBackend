const express = require("express");
const router = express.Router();
const Subgreddit = require("../models/Subgreddit");


router.put("/add", async (req, res) => {
  const { 
    subid,
    postid, 
    savedby } = req.body;

  const AkaSubgreddit = await Subgreddit.findOne({ _id: subid });
  
  if(!AkaSubgreddit){
    return res.json({ status: "AkaSubgreddit not found!",subid});
  }
  try {
    if(!AkaSubgreddit.post[postid].savedby.includes(savedby)){
      AkaSubgreddit.post[postid].savedby.push(savedby);
    }
    await AkaSubgreddit.save()
      .then((data) =>
        res.json({
          status: "Saved Post Successfully!",
          SubgredditData: data,
        })
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.send({ status: "Error Saving the Post!" });
  }
});

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

    console.log("From Backend Updated Post!", AkaSubgreddit);

    await AkaSubgreddit.save()
      .then(async (data) => {
        const AkaSubgreddits = await Subgreddit.find();
        res.json({
          status: "Updated Saved Post Successfully!",
          AkaSubgreddits: AkaSubgreddits,
          SubgredditData:data
        })
      }
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.status(500).send({ status: "Error Updating Post!" });
  }
});

router.put("/remove", async (req, res) => {
  const { 
    subid,
    postid, 
    savedby } = req.body;

  const AkaSubgreddit = await Subgreddit.findOne({ _id: subid });
  
  if(!AkaSubgreddit){
    return res.json({ status: "AkaSubgreddit not found!",subid});
  }
  try {
    
    AkaSubgreddit.post[postid].savedby = AkaSubgreddit.post[postid]
    .savedby.filter((savedbyUser) => {
      return savedbyUser !== savedby;
    });

    await AkaSubgreddit.save()
      .then(async (data) => {
        const AkaSubgreddits = await Subgreddit.find();
        res.json({
          status: "Removed Saved Post Successfully!",
          AkaSubgreddits: AkaSubgreddits,
          SubgredditData:data
        })
      }
      )
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    res.send({ status: "Error Saving the Post!" });
  }
});

module.exports = router;
