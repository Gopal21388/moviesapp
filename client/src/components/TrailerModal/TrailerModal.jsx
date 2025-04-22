import React, { useEffect, useState } from 'react'
import './TrailerModal.scss'
import ReactPlayer from 'react-player'
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import auth from '../../utils/firebase-config';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { removeLikedMovie } from '../../store/Slice/movie-slice';
import { FaStar } from "react-icons/fa";

const TrailerModal = ({ movie, handleModal, isLiked, trailer }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState(undefined)
  const [isLikedthumb, setIsLikedthumb] = useState(false);
  const [isDislikedthumb, setIsDislikedthumb] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const addToMovieLikedList = async () => {
    try {
      await axios.post('https://mern-movie-project.vercel.app/api/users/add', { email, movie });
      toast('Movie added to your list', {
        icon: '👌',
        style: { background: '#333', color: '#fff' }
      });
    } catch (err) {
      toast('Failed to add movie ❌', {
        icon: '⚠️',
        style: { background: '#333', color: '#fff' }
      });
    }
  }

  const removeFromMovieLikedList = () => {
    dispatch(removeLikedMovie({ email, movie }));
    toast('Movie removed from your list', {
      icon: '👌',
      style: { background: '#333', color: '#fff' }
    });
  }

  const playTrailer = () => {
    navigate("/trailer", {
      replace: true,
      state: { movie }
    })
  }

  const handleLikeTrailer = async () => {
    await axios.post('http://localhost:5000/api/users/like-trailer', {
      email,
      trailer: movie,
      rating: +1
    });
    toast("Liked trailer ✅");
    setIsLikedthumb(true);
    setIsDislikedthumb(false);
  };

  const handleDislikeTrailer = async () => {
    await axios.post('http://localhost:5000/api/users/dislike-trailer', {
      email,
      trailer: movie,
      rating: -1
    });
    toast("Disliked trailer ❌");
    setIsDislikedthumb(true);
    setIsLikedthumb(false);
  };

  const handleStarRating = async (rate) => {
    try {
      await axios.post('http://localhost:5000/api/users/rate-trailer', {
        email,
        trailerId: movie.id,
        rating: rate
      });
      setRating(rate);
      setSubmitted(true);
      toast(`Rated ${rate} ⭐`, {
        icon: '🌟',
        style: { background: '#333', color: '#fff' }
      });
    } catch (err) {
      toast('Rating failed ❌', {
        icon: '⚠️',
        style: { background: '#333', color: '#fff' }
      });
    }
  };

  return (
    <div className='overlay'>
      <div className='overlay--layer' onClick={() => handleModal(false)}></div>
      <div className='overlay__content'>
        <ReactPlayer
          className='overlay__content--video'
          url={`https://www.youtube.com/watch?v=${trailer}`}
          width='100%'
          playing
          controls={true}
          muted={true}
        />
        <div className='overlay__content--info'>
          <div className='overlay__content--info--icons'>
            <IoPlayCircleSharp title="Play" onClick={playTrailer} />
            <RiThumbUpFill title="Like" onClick={handleLikeTrailer} style={{ color: isLikedthumb ? 'green' : 'white' }} />
            <RiThumbDownFill title="Dislike" onClick={handleDislikeTrailer} style={{ color: isDislikedthumb ? 'red' : 'white' }} />
            {isLiked ? (
              <AiOutlineCheck title="Remove from List" onClick={removeFromMovieLikedList} />
            ) : (
              <AiOutlinePlus title="Add to my list" onClick={addToMovieLikedList} />
            )}
          </div>

          <div className='overlay__content--info--descr'>
            <div className='overlay__content--info--descr--text'>
              <h3>{movie.name}</h3>
              <p>{movie.overview}</p>
            </div>
            <div className='overlay__content--info--descr--content'>
              <ul>
                <li>Release Date: <span>{movie.release_date}</span></li>
                <li>Rating: <span>{movie.vote_average}</span></li>
                <li>Genres: {movie.genres.map((genre, index) => (
                  <span key={index}>{genre}</span>
                ))}</li>
                <li>Language: <span>{movie.original_language}</span></li>
              </ul>

              {/*  Rating UI */}
                            <div
                style={{
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    maxWidth: "100%",
                    overflow: "hidden"
                }}
                >
                <span style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 500 }}>
                    Your Rating:
                </span>

                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    flexShrink: 0
                    }}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={10} 
                        color={(hover || rating) >= star ? "#ffc107" : "#e4e5e9"}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => handleStarRating(star)}
                        style={{
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                        }}
                    />
                    ))}
                </div>

                {submitted && (
                    <span style={{ fontSize: "0.8rem", color: "lightgreen", fontWeight: 400 }}>
                    Thanks for rating!
                    </span>
                )}
                </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrailerModal;
