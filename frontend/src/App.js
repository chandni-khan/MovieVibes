import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import Login from "./components/Login";
import Register from "./components/Register";
import MoviesList from "./components/MoviesList";
import MovieDetail from "./components/MoviesDetails";
import AppNavbar from "./components/AppNavbar";
import ManageMovies from "./components/MangeMovies";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = JSON.parse(localStorage.getItem("role")); // Assuming user data is stored

  if (!token || role !== 1) {
    return <Navigate to="/movies" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <AppNavbar />
      <Container style={{ marginTop: "3rem" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MoviesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <ProtectedRoute>
                <MovieDetail />
              </ProtectedRoute>
            }
          />

         {/* Admin-Only Route for Movies CRUD */}
          <Route
            path="/admin/movies"
            element={
              <ProtectedAdminRoute>
                <ManageMovies />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}
