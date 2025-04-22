const User = require('../models/UserModel');


// module.exports.saveUser = async (req, res) => {
//     const { email, username } = req.body;

//     try {
//       // Check if the user already exists
//       let user = await User.findOne({ email });
//       if (!user) {
//         user = new User({ email, username });
//         await user.save();
//       }
  
//       res.status(201).json({ message: 'User saved to database' });
//     } catch (error) {
//       console.error('Error saving user:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
// }
module.exports.addtoLikedMovies = async (req, res) => {

    try{
        const {email, movie} = req.body;
        const user = await User.findOne({email});
        if(user){
            const likedMovies = user.likedMovies;
            const movieExists = likedMovies.find((m) => m.id === movie.id);
            if(movieExists){
               return res.json({message: 'Movie already liked'})
            }else{
                await User.findByIdAndUpdate(user._id, {
                    likedMovies: [...user.likedMovies, movie]
                }, {new: true});
        }
    }
    else{
        const newUser = new User({
            email,
            likedMovies: [movie]
        })
        newUser.save()
            .then((user) => {
                res.json({msg : 'success', user})
            })
            .catch((err) => {
                res.json({msg : 'error', err})
            })

        // await User.create({email, likedMovies: [movie]});
    }
    return res.json({message: 'Movie added to liked movies', movie })
    }
    catch(err){
        console.log(err.message);
        return res.json({message: 'Something went wrong'})
    }
}

module.exports.getLikedMovies = async (req,res) => {
    try{
        const {email} = req.params;
        const user = await User.findOne({email})
        if(user){
            res.json({msg : 'success', movies : user.likedMovies})
        }else{
            return res.json({message: 'User not found'})
        }

    }
    catch(err){
        return res.json({message: 'Something went wrong'})
    }
}

module.exports.removeFromLikedMovies = async (req,res) => {
    try{
        const {email, movie} = req.body;
        const user = await User.findOne({email});
        if(user){
            const {likedMovies} = user;
            const movieIndex = likedMovies.findIndex((m) => m.id === movie.id);
            if(movieIndex === -1){
                return res.json({message: 'Movie not found'})
            }
            const updatedLikedMovies = likedMovies.splice(movieIndex, 1)
            await User.findByIdAndUpdate(user._id, {
                likedMovies: updatedLikedMovies
                }, {new: true});
            return res.json({message: 'Movie removed from liked movies', movie })
        }else{
            return res.json({message: 'User not found'})
        }
    }
    catch(err){
        return res.json({message: 'Something went wrong'})
    }
}

module.exports.addToLikedTrailers = async (req, res) => {
  const { email, trailer } = req.body;
  //console.log(email, trailer);

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = new User({
        email,
        likedTrailers: [trailer],
        dislikedTrailers: [],
        likedMovies: []
      });
      await user.save();
      return res.json({ message: "User created and trailer liked" });
    }

    const alreadyLiked = user.likedTrailers.find(t => t.id === trailer.id);
    if (alreadyLiked) return res.json({ message: "Trailer already liked" });
    user.dislikedTrailers = user.dislikedTrailers.filter(t => t.id !== trailer.id);

    user.likedTrailers.push(trailer);
    await user.save();
    return res.json({ message: "Trailer liked" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
  
  module.exports.addToDislikedTrailers = async (req, res) => {
    const { email, trailer } = req.body;
    console.log(email, trailer);
  
    try {
      let user = await User.findOne({ email });
  
      if (!user) {
        // Create a new user if not found
        user = new User({
          email,
          dislikedTrailers: [trailer],
          likedTrailers: [],
          likedMovies: []
        });
        await user.save();
        return res.json({ message: "User created and trailer disliked" });
      }
  
      const alreadyDisliked = user.dislikedTrailers.find(t => t.id === trailer.id);
      if (alreadyDisliked) return res.json({ message: "Trailer already disliked" });
      user.likedTrailers = user.likedTrailers.filter(t => t.id !== trailer.id);
  
      user.dislikedTrailers.push(trailer);
      await user.save();
      return res.json({ message: "Trailer disliked" });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  

  module.exports.rateTrailer = async (req, res) => {
    const { email, trailerId, rating } = req.body; // rating = 1 or -1
  
    try {
      let user = await User.findOne({ email });
  
      if (!user) {
        user = new User({ email, ratings: [{ trailerId, rating }] });
        await user.save();
        return res.json({ message: 'User created and trailer rated' });
      }
  
      const existingRating = user.ratings.find(r => r.trailerId === trailerId);
      if (existingRating) {
        existingRating.rating = rating; // update rating
      } else {
        user.ratings.push({ trailerId, rating });
      }
  
      await user.save();
      return res.json({ message: 'Trailer rated successfully' });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  
