import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Importação de páginas e componentes
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProfileEdit from "./pages/ProfileEdit";
import MovieSearch from "./pages/movieSearch";
import MovieDetails from "./pages/movieDetails";
import Watchlist from "./pages/Watchlist";
import Navbar from "./components/Navbar";

// Importar CSS do Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "./trackfilmes.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas (requerem autenticação) */}
            <Route element={<ProtectedRoute />}>
              {/* Dashboard - substituído pela busca de filmes */}
              <Route path="/dashboard" element={<MovieSearch />} />

              {/* Página de busca de filmes */}
              <Route path="/movies/search" element={<MovieSearch />} />

              {/* Página de watchlist */}
              <Route path="/movies/watchlist" element={<Watchlist />} />

              {/* Página de detalhes do filme */}
              <Route path="/movie/:id" element={<MovieDetails />} />

              {/* Página de edição de perfil */}
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Route>

            {/* Redirecionar para a página de login como padrão */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
