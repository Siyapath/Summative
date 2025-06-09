// src/components/Feature.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Feature.css';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

const Feature = () => {
  const [movies, setMovies] = useState([]);
  const { addToCart, isInCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/now_playing',
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: 'en-US',
              page: 1,
            },
          }
        );
        const aMovies = response.data.results;
        const shuffle = aMovies.sort(() => 0.5 - Math.random());
        const randomFive = shuffle.slice(0, 16);

        setMovies(randomFive);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }

    fetchNowPlaying();
  }, []);

  return (
    <div className="feature">
      <h2>Featured Now Playing</h2>
      <div className="movie-cards">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
              <p><strong>{movie.title}</strong></p>
            </Link>

            {/* Only show Add to Cart if logged in */}
            {user?.loggedIn && (
              isInCart(movie.id) ? (
                <button disabled className="cart-button added">
                  Added to Cart
                </button>
              ) : (
                <button className="cart-button" onClick={() => addToCart(movie)}>
                  Add to Cart
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feature;
