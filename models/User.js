const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
   fname:{
      type: String,
      required: true
   },
   lname:{
      type: String,
      required: true
   },
   username:{
      type: String,
      unique: true,
      required: true
   },
   emailid: {
      type: String,
      required: true
   },
   age: {
      type: Number,
      required: true
   },
   phno: {
      type: Number,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   followers: [],
   following: []
},{
   timestamps: true,
   collection: 'users'
})

module.exports = mongoose.model('User', userSchema);