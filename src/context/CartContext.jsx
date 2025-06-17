import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { firebaseUser } = useContext(UserContext);
  const userId = firebaseUser?.uid || "guest";
  const storageKey = `cart_${userId}`;

  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem(storageKey);
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // When user changes, load their cart
  useEffect(() => {
    const storedCart = localStorage.getItem(storageKey);
    setCart(storedCart ? JSON.parse(storedCart) : []);
    // eslint-disable-next-line
  }, [userId]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    // eslint-disable-next-line
  }, [cart, storageKey]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!firebaseUser) {
      setCart([]);
    }
  }, [firebaseUser]);

  const addToCart = (movie) => {
    setCart((prev) => [...prev, movie]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((movie) => movie.id !== id));
  };

  const clearCart = () => setCart([]);

  const isInCart = (id) => cart.some((movie) => movie.id === id);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};