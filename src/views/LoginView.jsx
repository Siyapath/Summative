import React, { useState } from 'react';
import './LoginView.css';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, firestore } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const fetchUserInfo = async (uid) => {
    const userRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: uid, ...userSnap.data() };
    } else {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = await fetchUserInfo(user.uid);
      if (!userData) {
        // User authenticated but not registered in Firestore
        alert("You must register before logging in.");
        return;
      }

      // No need to call login() - context will update automatically
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        alert("Invalid email or password.");
      } else {
        alert("Login failed: " + err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Extract first and last name from displayName or email
        let first = "";
        let last = "";
        if (user.displayName) {
          const nameParts = user.displayName.split(" ");
          first = nameParts[0] || "";
          last = nameParts.slice(1).join(" ") || "";
        } else if (user.email) {
          const emailName = user.email.split("@")[0];
          const nameParts = emailName.split(/[._]/); // split on . or _
          first = nameParts[0] || "";
          last = nameParts.slice(1).join(" ") || "";
        }
        // Redirect to register with pre-filled info
        navigate("/register", {
          state: {
            email: user.email,
            firstName: first,
            lastName: last,
            googleUid: user.uid,
          },
        });
        return;
      }

      // No need to call login() - context will update automatically
      navigate('/');
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert("Google sign-in failed: " + err.message);
    }
  };

  return (
    <div className="login-view">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button type="button" className="google-login" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default LoginView;