// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// let SavedPost = new Schema(
// {
//     savedby: {
//         type: String,
//         required: true,
//     },
//     subgreddit: {
//         type: String,
//         required: true,
//     },
//     moderator: {
//         type: Number,
//         required: true
//     },
//     postedBy: {
//         type: String,
//         required: true,
//     },
//     postedIn: {
//         type: String,
//         required: true,
//     },
//     Text: {
//         type: String,
//         required: true,
//     },
//     // we store upvotes as list of id's/usernames of users who upvoted/downvoted
//     upvotes: [],  
//     downvotes: [],
//     comments: [String]
// },{
//    timestamps: true,
//    collection: 'savedpost'
// })

// module.exports = mongoose.model('savepost', SavedPost);