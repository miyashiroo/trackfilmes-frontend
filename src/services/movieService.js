import axios from "axios";

// Constantes para a API do TheMovieDB
const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const LANGUAGE = "pt-BR"; //

// Função para buscar filmes por termo
export const searchMovies = async (searchTerm, page = 1) => {
  try {
    console.log(
      `Buscando filmes com o termo: "${searchTerm}", página: ${page}`
    );
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(
        searchTerm
      )}&page=${page}&include_adult=false`
    );

    console.log(`Encontrados ${response.data.total_results} resultados`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    throw error;
  }
};

// Função para obter detalhes de um filme específico
export const getMovieDetails = async (movieId) => {
  try {
    console.log(`Obtendo detalhes do filme ID: ${movieId}`);
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}`
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao obter detalhes do filme ${movieId}:`, error);
    throw error;
  }
};

// Função para obter filmes populares para exibir na página inicial
export const getPopularMovies = async (page = 1) => {
  try {
    console.log(`Obtendo filmes populares, página: ${page}`);
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter filmes populares:", error);
    throw error;
  }
};

// Função para obter URL da imagem do poster do filme
export const getImageUrl = (path, size = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const movieService = {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getImageUrl,
};

export default movieService;
