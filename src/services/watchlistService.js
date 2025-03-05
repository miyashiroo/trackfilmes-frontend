import axios from "axios";

// URL base da API
const API_URL = "http://localhost:5000/api";

//cliente axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para adicionar um filme à watchlist

export const addToWatchlist = async (movieId) => {
  try {
    console.log("Adicionando filme à watchlist:", movieId);
    const response = await apiClient.post(`/watchlist/${movieId}`);
    console.log("Filme adicionado com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar filme à watchlist:", error);
    throw error;
  }
};

// Função para obter a watchlist do usuário
export const getWatchlist = async () => {
  try {
    console.log("Obtendo watchlist do usuário");
    const response = await apiClient.get("/watchlist");
    console.log("Watchlist obtida com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter watchlist:", error);
    throw error;
  }
};

// Função para remover um filme da watchlist
// Endpoint que espera somente o id

export const removeFromWatchlist = async (movieId) => {
  try {
    console.log("Removendo filme da watchlist:", movieId);
    const response = await apiClient.delete(`/watchlist/${movieId}`);
    console.log("Filme removido com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao remover filme da watchlist:", error);
    throw error;
  }
};

// Função para verificar se um filme está na watchlist
export const checkIfInWatchlist = async (movieId) => {
  try {
    console.log("Verificando se filme está na watchlist:", movieId);
    const response = await getWatchlist();
    console.log("Lista obtida para verificação:", response);

    if (response && response.watchlist && Array.isArray(response.watchlist)) {
      // Verificar se o filme está na lista comparando o ID
      const isInWatchlist = response.watchlist.some(
        (movie) =>
          movie.tmdbMovieId === parseInt(movieId) ||
          movie.tmdbMovieId === movieId
      );

      console.log(`Filme ${movieId} está na watchlist? ${isInWatchlist}`);
      return isInWatchlist;
    }

    return false;
  } catch (error) {
    console.error("Erro ao verificar filme na watchlist:", error);
    return false;
  }
};

// Função para marcar filme como assistido ou não assistido
export const toggleWatched = async (movieId, watched) => {
  try {
    console.log(
      `Marcando filme ${movieId} como ${
        watched ? "assistido" : "não assistido"
      }`
    );
    const response = await apiClient.patch(`/watchlist/${movieId}/watched`, {
      watched,
    });
    console.log("Status atualizado com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status do filme:", error);
    throw error;
  }
};

const watchlistService = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  checkIfInWatchlist,
  toggleWatched,
};

export default watchlistService;
