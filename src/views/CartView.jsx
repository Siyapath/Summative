import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CartView.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const CartView = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { firebaseUser, purchases, updatePurchases } = useContext(UserContext);
  const [thankYou, setThankYou] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!firebaseUser) {
      alert("You must be logged in to checkout.");
      return;
    }
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("No authenticated user found.");
        return;
      }
      // Get current purchases from Firestore (to avoid overwrite)
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      let prevPurchases = [];
      if (userDoc.exists()) {
        prevPurchases = userDoc.data().purchases || [];
      }
      // Only store title and release_date for each movie
      const cartPurchases = cart.map((movie) => ({
        title: movie.title,
        release_date: movie.release_date,
      }));
      // Avoid duplicates by title and release_date
      const newPurchases = [
        ...prevPurchases,
        ...cartPurchases.filter(
          (movie) =>
            !prevPurchases.some(
              (p) =>
                p.title === movie.title &&
                p.release_date === movie.release_date
            )
        ),
      ];
      await updateDoc(userDocRef, { purchases: newPurchases });
      if (typeof updatePurchases === "function") {
        updatePurchases(newPurchases);
      }
      clearCart();
      localStorage.removeItem("cart");
      setThankYou(true);
    } catch (err) {
      alert("Failed to complete checkout: " + err.message);
    }
  };

  if (thankYou) {
    return (
      <div className="cart-view">
        <Header />
        <div className="cart-container">
          <h2 className="text-black text-2xl font-semibold">Thank you for your purchase!</h2>
          <button className="back-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-view">
      <Header />
      <div className="cart-container">
        <h2 className="text-black text-2xl font-semibold">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-black mt-4">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((movie) => (
                <div key={movie.id} className="cart-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                  <div className="cart-details">
                    <h3>{movie.title}</h3>
                    <button onClick={() => removeFromCart(movie.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-buttons">
              <button className="checkout-button" onClick={handleCheckout}>
                Checkout
              </button>
              <button
                className="back-button"
                onClick={() => navigate("/")}
              >
                Back to Genres
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartView;