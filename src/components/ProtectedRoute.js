import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  // Se ainda estiver carregando, mostre um indicador de carregamento
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecione para o login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderize as rotas filhas
  return <Outlet />;
};

export default ProtectedRoute;
