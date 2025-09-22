const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  role: { type: String, default: 'user' },
  profileImage: String,
  bio: {type: String, maxLength:200},
  date: {type: Date, default: Date.now()}
});


const user = mongoose.model('user', userSchema);
module.exports = user;