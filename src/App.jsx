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

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/genre/:id" element={<GenreView />} />
            <Route path="/movie/:movieId" element={<MovieDetailView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/cart" element={<CartView />} /> {/* Add route for cart */}
            <Route path="*" element={<ErrorView />} />
            <Route path="/cart" element={<CartView />} />
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
