// src/services/authService.js
import axios from "axios";

// Definindo a URL base da API
const API_URL = "http://localhost:5000/api"; // URL correta do seu backend

// Cria um cliente axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cria um cliente axios para rotas públicas (sem interceptor de autenticação)
const publicApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autenticação apenas a rotas protegidas
apiClient.interceptors.request.use(
  (config) => {
    // Rotas públicas que não precisam de token
    const publicRoutes = ["/auth/register", "/auth/login"];

    // Verificar se a rota atual está na lista de rotas públicas
    const isPublicRoute = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    // Só adiciona o token se não for uma rota pública
    if (!isPublicRoute) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para registrar um novo usuário
export const registerUser = async (userData) => {
  try {
    console.log("Tentando registrar usuário com:", userData);
    // Usando o cliente público que não adiciona token
    const response = await publicApiClient.post("/auth/register", userData);
    console.log("Resposta do servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro durante o registro:", error.response || error);
    throw error;
  }
};

// Função para fazer login
export const loginUser = async (credentials) => {
  try {
    console.log("Tentando login com credenciais:", credentials);
    // Usando o cliente público que não adiciona token
    const response = await publicApiClient.post("/auth/login", credentials);
    console.log("Resposta do login:", response.data);

    // Salva o token e as informações do usuário no localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Erro durante o login:", error.response || error);
    throw error;
  }
};

// Função para atualizar os dados do usuário
export const updateUserProfile = async (userData) => {
  try {
    console.log("Atualizando perfil do usuário:", userData);
    // Ajustando o endpoint para o padrão /auth/ em vez de /users/
    const response = await apiClient.put("/auth/profile", userData);
    console.log("Resposta da atualização:", response.data);

    // Atualiza os dados do usuário no localStorage
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error.response || error);
    throw error;
  }
};

// Função para atualizar a senha
export const updatePassword = async (passwordData) => {
  try {
    console.log("Enviando dados para atualização de senha:", {
      currentPassword: "********", // Ocultado por segurança
      newPassword: "********", // Ocultado por segurança
    });
    // Ajustando o endpoint para o padrão /auth/ em vez de /users/
    const response = await apiClient.put("/auth/password", passwordData);
    console.log("Resposta da atualização de senha:", "Sucesso");
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar senha:", error.response || error);
    throw error;
  }
};

// Função para excluir a conta do usuário
export const deleteAccount = async (password) => {
  try {
    console.log("Enviando solicitação para exclusão de conta");

    // Alterando o método de HTTP POST para DELETE
    // Para enviar dados no corpo de uma requisição DELETE, precisamos configurar explicitamente
    const response = await apiClient.delete("/users/delete", {
      data: { password },
    });

    console.log("Resposta da exclusão:", response.status, response.statusText);

    // Após excluir a conta, remove os dados de autenticação
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return response.data;
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    if (error.response) {
      console.error("Resposta do servidor:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    }
    throw error;
  }
};

// Função para fazer logout
export const logoutUser = () => {
  console.log("Realizando logout...");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Função para obter o usuário atual
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Serviço para exportar
const authService = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  updateUserProfile,
  updatePassword,
  deleteAccount,
};

export default authService;
