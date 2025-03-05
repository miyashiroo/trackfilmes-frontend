import React, { useState } from "react";
import axios from "axios";

const DebugWatchlist = () => {
  const [movieId, setMovieId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api";

  const handleCheckManually = async () => {
    if (!movieId) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      // Obter token do localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Não há token de autenticação. Faça login primeiro.");
        return;
      }

      // Testar endpoint de check
      const response = await axios.get(
        `${API_URL}/watchlist/check/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mostrar resultado completo
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });
    } catch (err) {
      setError(`Erro: ${err.message}`);
      if (err.response) {
        setResult({
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 p-4 border rounded bg-light">
      <h4>Debug da Watchlist</h4>

      <div className="mb-3">
        <label className="form-label">ID do Filme para testar:</label>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            placeholder="Digite o ID do filme (Ex: 123)"
          />
          <button
            className="btn btn-primary"
            onClick={handleCheckManually}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="mt-3">
          <h5>Resultado:</h5>
          <pre
            className="bg-dark text-light p-3 rounded"
            style={{ maxHeight: "300px", overflow: "auto" }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugWatchlist;
