const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  likedTrailers: Array,
  dislikedTrailers: Array,
  likedMovies: Array ,// keep this for movies if needed
  ratings: [
    {
      trailerId: String,
      rating: Number
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
