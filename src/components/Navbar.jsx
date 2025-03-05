// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const Navbar = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Trackfilmes
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Olá, {currentUser?.name || "Usuário"}
                  </span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Início
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/movies/search">
                    Buscar Filmes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/movies/watchlist">
                    Minha Watchlist
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile/edit">
                    Editar Perfil
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Cadastrar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
