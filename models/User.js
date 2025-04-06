const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
  age: Number,
  gender: String,
});

module.exports = mongoose.model('User', userSchema);
