import React, { useContext, useState, useEffect } from 'react';
import './SettingsView.css';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { getAuth, updateProfile, updatePassword } from "firebase/auth";

const SettingsView = () => {
  const { firebaseUser, genres, purchases, updateGenres } = useContext(UserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(
    (genres || []).map(g => (typeof g === "object" && g !== null ? g.id : g))
  );
  const [allGenres, setAllGenres] = useState([]);
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();
  const allowedGenreIds = [28, 80, 36, 878, 12, 10751, 27, 10752, 16, 14, 9648, 37];

  // Check if user is email/password
  const isEmailPasswordUser = firebaseUser?.providerData?.[0]?.providerId === "password";

  // Fetch Firestore user info for first/last name
  useEffect(() => {
    const fetchUserNames = async () => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || firebaseUser.displayName?.split(" ")[0] || "");
          setLastName(data.lastName || firebaseUser.displayName?.split(" ")[1] || "");
        } else {
          setFirstName(firebaseUser.displayName?.split(" ")[0] || "");
          setLastName(firebaseUser.displayName?.split(" ")[1] || "");
        }
      }
    };
    fetchUserNames();
    // eslint-disable-next-line
  }, [firebaseUser]);

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
        setAllGenres(filtered);
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (selectedGenres.length < 5) {
      alert('Please select at least 5 genres.');
      return;
    }

    // Map selected IDs to objects with id and name
    const selectedGenreObjects = allGenres
      .filter(g => selectedGenres.includes(g.id))
      .map(g => ({ id: g.id, name: g.name }));

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("No authenticated user found.");
        return;
      }

      // Update genres in Firestore and context
      await updateDoc(doc(firestore, "users", currentUser.uid), {
        genrePreferences: selectedGenreObjects,
      });
      await updateGenres(selectedGenreObjects);

      // Only allow name/password change for email/password users
      if (isEmailPasswordUser) {
        // Update Firebase Auth profile
        await updateProfile(currentUser, {
          displayName: `${firstName} ${lastName}`.trim(),
        });
        // Update Firestore
        await updateDoc(doc(firestore, "users", currentUser.uid), {
          firstName,
          lastName,
        });
        // Update password if provided
        if (password) {
          await updatePassword(currentUser, password);
        }
      }
      setShowSuccess(true);
      setPassword("");
    } catch (err) {
      alert("Failed to update settings: " + err.message);
    }
  };

  const handleBack = () => {
    const genreId = selectedGenres.length > 0 ? selectedGenres[0] : 28;
    navigate(`/genre/${genreId}`);
  };

  return (
    <div className="settings-view">
      <form className="settings-form" onSubmit={handleSave}>
        <h2>User Settings</h2>
        <p><strong>Email:</strong> {firebaseUser?.email}</p>
        {isEmailPasswordUser && (
          <>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (leave blank to keep current)"
              autoComplete="new-password"
            />
          </>
        )}

        <div className="genre-checkboxes">
          <p>Update your favorite genres (select at least 5):</p>
          {allGenres.map((genre) => (
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

        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleBack} className="back-button">Back to Genres</button>
        {showSuccess && <p className="success-message">Settings updated!</p>}

        <div>
          <h3>Past Purchases</h3>
          <ul>
            {(purchases || []).map((p, i) => (
              <li key={i}>{p.title} ({p.release_date})</li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;