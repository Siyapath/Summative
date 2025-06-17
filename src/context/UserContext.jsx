import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored
      ? { ...JSON.parse(stored), loggedIn: true }
      : {
          firstName: '',
          lastName: '',
          email: '',
          genres: [],
          purchases: [],
          loggedIn: false
        };
  });

  useEffect(() => {
    if (user && user.loggedIn) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      genres: [],
      purchases: [],
      loggedIn: false
    });
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};