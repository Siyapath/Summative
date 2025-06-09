import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Genres from "../components/Genres";
import "./GenreView.css";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";


const GenreView = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart, removeFromCart, isInCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              with_genres: id,
              page: page,
            },
          }
        );

        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 10)); // does max pages to 4
      } catch (err) {
        console.error("Failed to fetch genre movies:", err);
      }
    };

    fetchMoviesByGenre();
  }, [id, page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="home-view genre-view">
      <Header />

      <div className="main-layout">
        <aside className="sidebar">
          <Genres />
        </aside>

        <div className="content-area">
          <h2>Movies in this Genre</h2>
          <div className="movie-cards">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <p>
                    <strong>{movie.title}</strong>
                  </p>
                </Link>
                {user.loggedIn &&
                  (isInCart(movie.id) ? (
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
                  ))}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
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

export default GenreView;
