// src/pages/MovieSearch.jsx
import React, { useState, useEffect } from "react";
import {
  searchMovies,
  getPopularMovies,
  getImageUrl,
} from "../services/movieService";
import { Link } from "react-router-dom";

const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Carregar filmes populares ao iniciar a página
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPopularMovies();
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
      } catch (err) {
        setError("Erro ao carregar filmes populares. Tente novamente.");
        console.error("Erro ao carregar filmes populares:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!isSearching) {
      loadPopularMovies();
    }
  }, [isSearching]);

  // Função para realizar a busca
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIsSearching(true);

      const data = await searchMovies(searchTerm);

      setMovies(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(data.page);

      if (data.results.length === 0) {
        setError(`Nenhum filme encontrado para "${searchTerm}"`);
      }
    } catch (err) {
      setError("Erro ao buscar filmes. Tente novamente.");
      console.error("Erro na busca:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar mais filmes (próxima página)
  const handleLoadMore = async () => {
    if (currentPage >= totalPages) return;

    try {
      setLoading(true);
      setError("");

      const nextPage = currentPage + 1;
      const data = isSearching
        ? await searchMovies(searchTerm, nextPage)
        : await getPopularMovies(nextPage);

      setMovies([...movies, ...data.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError("Erro ao carregar mais filmes. Tente novamente.");
      console.error("Erro ao carregar mais filmes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Busca de Filmes</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Digite o título ou termo de busca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Buscar
          </button>
        </div>
      </form>

      {loading && movies.length === 0 && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card h-100">
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path)}
                  className="card-img-top"
                  alt={movie.title}
                />
              ) : (
                <div
                  className="card-img-top bg-secondary d-flex justify-content-center align-items-center"
                  style={{ height: "300px" }}
                >
                  <span className="text-white">Sem imagem</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text small">
                  {movie.release_date && (
                    <>
                      Lançamento:{" "}
                      {new Date(movie.release_date).toLocaleDateString("pt-BR")}
                    </>
                  )}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-warning text-dark">
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}{" "}
                    ★
                  </span>
                  <Link
                    to={`/movie/${movie.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Detalhes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {movies.length > 0 && currentPage < totalPages && (
        <div className="text-center mt-3 mb-5">
          <button
            className="btn btn-outline-primary"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Carregar Mais"}
          </button>
        </div>
      )}

      {movies.length > 0 && currentPage >= totalPages && (
        <div className="alert alert-info text-center mt-3">
          Não há mais filmes para carregar.
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
