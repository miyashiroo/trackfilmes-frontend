// src/contexts/authContext.js
import React, { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  isAuthenticated,
  logoutUser,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar o estado de autenticação ao carregar o aplicativo
    const checkAuthStatus = () => {
      if (isAuthenticated()) {
        setCurrentUser(getCurrentUser());
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Função para atualizar o estado após o login
  const login = (userData) => {
    console.log("Atualizando estado com dados do usuário:", userData);
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  // Função para atualizar o estado após o logout
  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // Função para atualizar os dados do usuário
  const updateUserData = (newUserData) => {
    // Atualiza o usuário no localStorage
    localStorage.setItem("user", JSON.stringify(newUserData));
    // Atualiza o estado
    setCurrentUser(newUserData);
  };

  // Valores expostos pelo contexto
  const value = {
    currentUser,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
