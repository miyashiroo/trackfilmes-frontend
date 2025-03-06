import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getWatchlist,
  removeFromWatchlist,
  toggleWatched,
} from "../services/watchlistService";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'watched', 'unwatched'

  // Carregar a watchlist ao montar o componente
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getWatchlist();
        console.log("Resposta da watchlist:", response);

        // Verificar a estrutura da resposta e extrair os filmes corretamente
        if (response && response.watchlist) {
          setWatchlist(response.watchlist);
        } else {
          console.error("Formato inesperado de resposta:", response);
          setWatchlist([]);
        }
      } catch (err) {
        console.error("Erro ao carregar watchlist:", err);
        setError(
          "Não foi possível carregar sua watchlist. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  // Função para remover um filme da watchlist
  const handleRemoveMovie = async (movieId) => {
    try {
      setRemovingId(movieId);
      await removeFromWatchlist(movieId);
      // Atualiza a lista removendo o filme
      setWatchlist(watchlist.filter((movie) => movie.tmdbMovieId !== movieId));
    } catch (err) {
      console.error("Erro ao remover filme:", err);
      setError("Erro ao remover filme. Tente novamente.");
    } finally {
      setRemovingId(null);
    }
  };

  // Função para marcar filme como assistido ou não assistido
  const handleToggleWatched = async (movieId, currentWatchedStatus) => {
    try {
      setTogglingId(movieId);
      const newWatchedStatus = !currentWatchedStatus;

      await toggleWatched(movieId, newWatchedStatus);

      // Atualiza a lista com o novo status
      setWatchlist(
        watchlist.map((movie) =>
          movie.tmdbMovieId === movieId
            ? {
                ...movie,
                watched: newWatchedStatus,
                watchedAt: newWatchedStatus ? new Date() : null,
              }
            : movie
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar status do filme:", err);
      setError("Erro ao atualizar status do filme. Tente novamente.");
    } finally {
      setTogglingId(null);
    }
  };

  // Filtrar a watchlist de acordo com o filtro ativo
  const filteredWatchlist = watchlist.filter((movie) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "watched") return movie.watched;
    if (activeFilter === "unwatched") return !movie.watched;
    return true;
  });

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return "Data desconhecida";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando sua lista...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Minha Watchlist</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filtros */}
      <div className="btn-group mb-4">
        <button
          className={`btn btn-outline-primary ${
            activeFilter === "all" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("all")}
        >
          Todos
        </button>
        <button
          className={`btn btn-outline-primary ${
            activeFilter === "watched" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("watched")}
        >
          Assistidos
        </button>
        <button
          className={`btn btn-outline-primary ${
            activeFilter === "unwatched" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("unwatched")}
        >
          Não Assistidos
        </button>
      </div>

      {watchlist.length === 0 && !loading && !error && (
        <div className="alert alert-info">
          <p className="mb-0">Sua watchlist está vazia.</p>
          <p className="mb-0">
            Comece a adicionar filmes através da{" "}
            <Link to="/movies/search">busca</Link>!
          </p>
        </div>
      )}

      {filteredWatchlist.length === 0 && watchlist.length > 0 && (
        <div className="alert alert-info">
          <p className="mb-0">Nenhum filme encontrado com o filtro atual.</p>
        </div>
      )}

      <div className="row">
        {filteredWatchlist.map((movie) => (
          <div key={movie.id} className="col-md-3 col-sm-6 mb-4">
            <div
              className={`card h-100 ${movie.watched ? "border-success" : ""}`}
            >
              {movie.watched && (
                <div className="position-absolute top-0 end-0 bg-success text-white p-2 m-2 rounded">
                  <i className="bi bi-check-circle"></i> Assistido
                </div>
              )}

              {movie.posterPath ? (
                <img
                  src={
                    movie.posterPath.startsWith("http")
                      ? movie.posterPath
                      : `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                  }
                  className="card-img-top"
                  alt={movie.title}
                  style={movie.watched ? { opacity: 0.7 } : {}}
                />
              ) : (
                <div
                  className="card-img-top bg-secondary d-flex justify-content-center align-items-center"
                  style={{ height: "300px" }}
                >
                  <span className="text-white">Sem imagem</span>
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text small">
                  {movie.addedAt && (
                    <>Adicionado em: {formatDate(movie.addedAt)}</>
                  )}
                </p>

                {movie.watched && movie.watchedAt && (
                  <p className="card-text small text-success">
                    Assistido em: {formatDate(movie.watchedAt)}
                  </p>
                )}

                <div className="mt-auto">
                  <div className="d-flex justify-content-between mb-2">
                    <button
                      className={`btn btn-sm ${
                        movie.watched
                          ? "btn-outline-success"
                          : "btn-outline-primary"
                      }`}
                      onClick={() =>
                        handleToggleWatched(movie.tmdbMovieId, movie.watched)
                      }
                      disabled={togglingId === movie.tmdbMovieId}
                    >
                      {togglingId === movie.tmdbMovieId ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : movie.watched ? (
                        "Não Assistido"
                      ) : (
                        "Assistido"
                      )}
                    </button>

                    <Link
                      to={`/movie/${movie.tmdbMovieId}`}
                      className="btn btn-sm btn-primary"
                    >
                      Detalhes
                    </Link>
                  </div>

                  <button
                    className="btn btn-sm btn-danger w-100"
                    onClick={() => handleRemoveMovie(movie.tmdbMovieId)}
                    disabled={removingId === movie.tmdbMovieId}
                  >
                    {removingId === movie.tmdbMovieId ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Remover"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
