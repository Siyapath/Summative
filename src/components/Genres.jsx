import React, { useEffect, useState, useContext } from 'react';
import './Genres.css';
import axios from 'axios';
import { Link, useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { id: selectedGenreId } = useParams();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Only fetch and show genres if user has preferences
        if (user && Array.isArray(user.genres) && user.genres.length > 0) {
          const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: 'en-US',
            },
          });
          // Only keep genres that match the user's preferred genre names
          const filtered = res.data.genres.filter((g) => user.genres.includes(g.name));
          setGenres(filtered);
        } else {
          setGenres([]);
        }
      } catch (err) {
        setGenres([]);
      }
    };

    fetchGenres();
  }, [user]);

  // Hide genre bar on register page
  if (location.pathname === '/register') {
    return null;
  }

  return (
    <div className="genres-list">
      <h3>Genres</h3>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>
            <Link
              to={`/genre/${genre.id}`}
              className={selectedGenreId === String(genre.id) ? 'active-genre' : ''}
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Genres;