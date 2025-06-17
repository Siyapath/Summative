// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import GenreView from './views/GenreView';
import MovieDetailView from './views/MovieDetailView';
import ErrorView from './views/ErrorView';
import SettingsView from './views/SettingsView';
import SearchView from './views/SearchView';
import CartView from './views/CartView';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route
              path="/genre/:id"
              element={
                <PrivateRoute>
                  <GenreView />
                </PrivateRoute>
              }
            />
            <Route
              path="/movie/:movieId"
              element={
                <PrivateRoute>
                  <MovieDetailView />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsView />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <SearchView />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartView />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<ErrorView />} />
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;