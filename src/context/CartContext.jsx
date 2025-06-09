// src/context/CartContext.jsx
import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (movie) => {
    if (!cart.find((m) => m.id === movie.id)) {
      setCart([...cart, movie]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((m) => m.id !== id));
  };

  const isInCart = (id) => {
    return cart.some((m) => m.id === id);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};
