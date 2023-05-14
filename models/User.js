const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
   fname:{
      type: String,
   },
   lname:{
      type: String,
   },
   username:{
      type: String,
      unique: true,
      required: true
   },
   emailid: {
      type: String,
      unique: true
   },
   age: {
      type: Number,
   },
   phno: {
      type: Number,
   },
   password: {
      type: String,
   },
   followers: [],
   following: []
},{
   timestamps: true,
   collection: 'users'
})

module.exports = mongoose.model('User', userSchema);