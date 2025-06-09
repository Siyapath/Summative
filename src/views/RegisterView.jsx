import React, { useState, useEffect, useContext } from 'react';
import './RegisterView.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterView = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const { register } = useContext(UserContext);
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

  const handleRegister = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !rePassword) {
      alert('All fields are required.');
      return;
    }
    if (password !== rePassword) {
      alert('Passwords do not match.');
      return;
    }
    if (selectedGenres.length < 5) {
      alert('Please select at least 5 genres.');
      return;
    }

    register({
      firstName,
      lastName,
      email,
      username: email.split('@')[0],
      password,
      genres: selectedGenres,
      loggedIn: true
    });

    navigate(`/genre/${selectedGenres[0]}`);
  };

  // Only show the genre checkboxes in the register form, no sidebar
  // After registration, user will only see their selected genres in the sidebar (handled in other views)

  return (
    <div className="register-view">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Re-enter Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />

        <div className="genre-checkboxes">
          <p>Select at least 5 favorite genres:</p>
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

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterView;
