import React, { useContext, useState, useEffect } from 'react';
import './SettingsView.css';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SettingsView = () => {
  const { user, setUser } = useContext(UserContext);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [selectedGenres, setSelectedGenres] = useState(user.genres || []);
  const [genres, setGenres] = useState([]);

  const navigate = useNavigate();

  const allowedGenreIds = [28, 80, 36, 878, 12, 10751, 27, 10752, 16, 14, 9648, 37];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: 'en-US',
          },
        });
        const filtered = res.data.genres.filter(g => allowedGenreIds.includes(g.id));
        setGenres(filtered);
      } catch (err) {
        alert('Failed to load genres');
      }
    };
    fetchGenres();
  }, []);

  const handleGenreChange = (id) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedGenres.length < 5) {
      alert('Please select at least 5 genres.');
      return;
    }

    setUser(prev => ({
      ...prev,
      firstName,
      lastName,
      genres: selectedGenres
    }));

    // Navigate to first selected genre after save
    const genreId = selectedGenres.length > 0 ? selectedGenres[0] : 28;
    navigate(`/genre/${genreId}`);
  };

  const handleBack = () => {
    const genreId = selectedGenres.length > 0 ? selectedGenres[0] : 28;
    navigate(`/genre/${genreId}`);
  };

  return (
    <div className="settings-view">
      <div className="settings-form">
        <h2>User Settings</h2>
        <p><strong>Email:</strong> {user.email}</p>

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />

        <div className="genre-checkboxes">
          <p>Update your favorite genres (select at least 5):</p>
          {genres.map((genre) => (
            <label key={genre.id}>
              <input
                type="checkbox"
                value={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </div>

        <button onClick={handleSave}>Save Changes</button>
        <button onClick={handleBack} className="back-button">Back to Genres</button>
      </div>
    </div>
  );
};

export default SettingsView;
