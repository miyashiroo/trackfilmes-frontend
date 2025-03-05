// src/pages/MovieDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getImageUrl } from "../services/movieService";
import {
  addToWatchlist,
  checkIfInWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";
import DebugWatchlist from "../components/DebugWatchlist";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [removingFromWatchlist, setRemovingFromWatchlist] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        setError("");

        // Carregar detalhes do filme
        const movieData = await getMovieDetails(id);
        setMovie(movieData);

        // Verificar se o filme já está na watchlist
        console.log("Verificando filme na watchlist:", id);
        const inWatchlist = await checkIfInWatchlist(id);
        console.log("Resultado da verificação:", inWatchlist);
        setIsInWatchlist(inWatchlist);
      } catch (err) {
        console.error("Erro ao carregar dados do filme:", err);
        setError("Não foi possível carregar os detalhes deste filme.");
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [id]);

  // Função para adicionar à watchlist
  const handleAddToWatchlist = async () => {
    try {
      setAddingToWatchlist(true);
      setError("");

      // Passando apenas o ID do filme
      await addToWatchlist(movie.id);

      setIsInWatchlist(true);
    } catch (err) {
      console.error("Erro ao adicionar à watchlist:", err);
      setError("Erro ao adicionar filme à watchlist. Tente novamente.");
    } finally {
      setAddingToWatchlist(false);
    }
  };

  // Função para remover da watchlist
  const handleRemoveFromWatchlist = async () => {
    try {
      setRemovingFromWatchlist(true);
      setError("");

      await removeFromWatchlist(movie.id);

      setIsInWatchlist(false);
    } catch (err) {
      console.error("Erro ao remover da watchlist:", err);
      setError("Erro ao remover filme da watchlist. Tente novamente.");
    } finally {
      setRemovingFromWatchlist(false);
    }
  };

  // Formatar dinheiro como moeda
  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Formatar duração em horas e minutos
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-md-4">
          {movie.poster_path ? (
            <img
              src={getImageUrl(movie.poster_path)}
              className="img-fluid rounded"
              alt={movie.title}
            />
          ) : (
            <div
              className="bg-secondary d-flex justify-content-center align-items-center rounded"
              style={{ height: "450px" }}
            >
              <span className="text-white">Sem imagem</span>
            </div>
          )}
        </div>

        <div className="col-md-8">
          <h1 className="mb-2">{movie.title}</h1>

          {movie.tagline && (
            <p className="fst-italic text-muted mb-3">{movie.tagline}</p>
          )}

          <div className="d-flex flex-wrap gap-2 mb-3">
            {movie.genres &&
              movie.genres.map((genre) => (
                <span key={genre.id} className="badge bg-secondary">
                  {genre.name}
                </span>
              ))}
          </div>

          <div className="mb-4">
            <p>
              <span className="fw-bold">Data de lançamento:</span>{" "}
              {formatDate(movie.release_date)}
            </p>
            <p>
              <span className="fw-bold">Duração:</span>{" "}
              {formatRuntime(movie.runtime)}
            </p>
            <p>
              <span className="fw-bold">Avaliação:</span>{" "}
              {movie.vote_average
                ? `${movie.vote_average.toFixed(1)}/10`
                : "N/A"}
            </p>
            <p>
              <span className="fw-bold">Orçamento:</span>{" "}
              {formatCurrency(movie.budget)}
            </p>
            <p>
              <span className="fw-bold">Receita:</span>{" "}
              {formatCurrency(movie.revenue)}
            </p>
          </div>

          <div className="mb-4">
            <h5>Sinopse</h5>
            <p>{movie.overview || "Sem sinopse disponível."}</p>
          </div>

          <div className="d-flex gap-2">
            {isInWatchlist ? (
              <button
                className="btn btn-danger"
                onClick={handleRemoveFromWatchlist}
                disabled={removingFromWatchlist}
              >
                {removingFromWatchlist ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Removendo...
                  </>
                ) : (
                  <>- Remover da Watchlist</>
                )}
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleAddToWatchlist}
                disabled={addingToWatchlist}
              >
                {addingToWatchlist ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Adicionando...
                  </>
                ) : (
                  <>+ Adicionar à Watchlist</>
                )}
              </button>
            )}

            <button
              className="btn btn-outline-primary"
              onClick={() => navigate(-1)}
            >
              Voltar
            </button>
          </div>

          {/* <div className="mt-2">
            <small className="text-muted">
              Estado na watchlist:{" "}
              {isInWatchlist ? "Na watchlist" : "Não está na watchlist"}
            </small>
          </div> */}

          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
      {/* Componente de debug para ajudar a solucionar o problema */}
      {/* <div className="row mt-4">
        <div className="col-12">
          <details>
            <summary
              className="mb-2 text-primary"
              style={{ cursor: "pointer" }}
            >
              <strong>Debug da Watchlist</strong> (clique para expandir)
            </summary>
            <DebugWatchlist />
          </details>
        </div>
      </div> */}
    </div>
  );
};

export default MovieDetails;
