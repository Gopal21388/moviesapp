const {
    addtoLikedMovies,
    getLikedMovies,
    removeFromLikedMovies,
    addToLikedTrailers,
    addToDislikedTrailers,
    rateTrailer
   
  } = require('../controllers/UserControl');

 
  
  const router = require('express').Router();
  // router.get('/test', (req, res) => {
  //   res.send("Test route working!");
  // });
  //router.post("/register", saveUser);
  const User = require('../models/UserModel'); // adjust path if needed

router.post('/login', async (req, res) => {
  
  const { email } = req.body;
  console.log(email);

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
      await user.save();
      return res.status(201).json({ message: 'User registered and saved' });
    }

    return res.status(200).json({ message: 'User already exists' });

  } catch (err) {
    console.error('Error saving user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports.getTrailerRating = async (req, res) => {
  const { trailerId } = req.params;

  try {
    const users = await User.find({ "ratings.trailerId": trailerId });
    let total = 0, count = 0;

    users.forEach(user => {
      const rating = user.ratings.find(r => r.trailerId === trailerId);
      if (rating) {
        total += rating.rating;
        count += 1;
      }
    });

    const avgRating = count ? (total / count).toFixed(2) : "0";

    res.json({ trailerId, averageRating: avgRating, votes: count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching rating" });
  }
};


  
  
  router.get('/liked/:email', getLikedMovies);
  router.post('/add', addtoLikedMovies);
  router.put('/remove', removeFromLikedMovies);
  
  router.post('/like-trailer', addToLikedTrailers);
  router.post('/dislike-trailer', addToDislikedTrailers);
  router.post('/rate-trailer', rateTrailer);
  
  module.exports = router;
  