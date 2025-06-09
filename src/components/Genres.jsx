// Genres.jsx
import React, { useEffect, useState, useContext } from 'react';
import './Genres.css';
import axios from 'axios';
import { Link, useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const allowedGenreIds = [28, 80, 36, 878, 12, 10751, 27, 10752, 16, 14, 9648, 37];

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { id: selectedGenreId } = useParams();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: 'en-US',
          },
        });
        let filtered = res.data.genres.filter((g) => allowedGenreIds.includes(g.id));
        // If user is logged in and has selected genres, show only those
        if (user && user.loggedIn && user.genres && user.genres.length > 0) {
          filtered = filtered.filter((g) => user.genres.includes(g.id));
        }
        setGenres(filtered);
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
