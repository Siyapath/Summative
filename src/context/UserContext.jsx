import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    genres: [],
    loggedIn: false
  });

  const login = (username) => {
    setUser((prev) => ({
      ...prev,
      username,
      loggedIn: true
    }));
  };

  const logout = () => {
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      genres: [],
      loggedIn: false
    });
  };

  const register = (userData) => {
    setUser({
      ...userData,
      loggedIn: true
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};
