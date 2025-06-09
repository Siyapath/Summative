import React, { useState, useContext } from 'react';
import './LoginView.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext);  // use login function from context
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = email.split('@')[0]; // extract username from email
    login(username); // call login function with username string
    navigate('/');
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
      </form>
    </div>
  );
};

export default LoginView;
