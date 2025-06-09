import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Header from "../components/Header"
import Footer from "../components/Footer";
import "./CartView.css";
import { useNavigate } from "react-router-dom";

const CartView = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="cart-view">
      <Header />
      <div className="cart-container">
        <h2 className="text-black text-2xl font-semibold">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-black mt-4">Your cart is empty</p>
        ) : (
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
        )}

        {/*Back to Genres Button */}
        <button
          className="back-button"
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back to Genres
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CartView;
