import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const Navbar = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Verificar se o link está ativo
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="me-2"
          >
            <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18v15.64C2 21.03 2.97 22 4.18 22h15.64c1.21 0 2.18-.97 2.18-2.18V4.18C22 2.97 21.03 2 19.82 2z" />
            <path d="M7 2v20" />
            <path d="M17 2v20" />
            <path d="M2 12h20" />
            <path d="M2 7h5" />
            <path d="M2 17h5" />
            <path d="M17 17h5" />
            <path d="M17 7h5" />
          </svg>
          TrackFilmes
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/dashboard")}`}
                    to="/dashboard"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-house-door me-1"></i>
                    Início
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/movies/search")}`}
                    to="/movies/search"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-search me-1"></i>
                    Buscar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/movies/watchlist")}`}
                    to="/movies/watchlist"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-bookmark-check me-1"></i>
                    Watchlist
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/profile/edit")}`}
                    to="/profile/edit"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {currentUser?.name || "Perfil"}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/login")}`}
                    to="/login"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link btn btn-outline-light btn-sm px-3 ms-2"
                    to="/signup"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-person-plus me-1"></i>
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
