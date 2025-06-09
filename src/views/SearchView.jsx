// src/views/SearchView.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Genres from "../components/Genres";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import "./SearchView.css";

const SearchView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart, isInCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!query || query.trim() === "") {
      return (
        <div className="search-view">
          <Header />
          <div className="main-layout">
            <aside className="sidebar">
              <Genres />
            </aside>
            <div className="content-area">
              <p className="error">Please enter a valid search query.</p>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
    

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/search/movie",
          {
            params: {
              query,
              include_adult: false,
              language: "en-US",
              page,
            },
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
            },
          }
        );
        setResults(response.data.results || []);
        setTotalPages(Math.min(response.data.total_pages || 1, 10));
        setError("");
      } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to fetch results.");
      }
    };

    fetchResults();
  }, [query, page]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="search-view">
      <Header />
      <div className="main-layout">
        <aside className="sidebar">
          <Genres />
        </aside>

        <div className="content-area">
          <h2>Search Results for "{query}"</h2>
          {error && <p className="error">{error}</p>}

          <div className="movie-cards">
            {results.length === 0 && !error ? (
              <p>No results found.</p>
            ) : (
              results.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <Link to={`/movie/${movie.id}`}>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title || "Movie Poster"}
                      />
                    ) : (
                      <div className="no-poster">No Poster</div>
                    )}
                    <p><strong>{movie.title || "Untitled"}</strong></p>
                  </Link>

                  {/* Add to Cart only if user is logged in */}
                  {user?.loggedIn && (
                    isInCart(movie.id) ? (
                      <button disabled className="cart-button added">
                        Added to Cart
                      </button>
                    ) : (
                      <button
                        className="cart-button"
                        onClick={() => addToCart(movie)}
                      >
                        Add to Cart
                      </button>
                    )
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={handleNext} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchView;
