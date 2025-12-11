// src/App.jsx
// src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import TodoPage from "./components/TodoPage";
import { getCurrentUser } from "./auth";
import "./App.css";

function App() {
  // user stockera l'objet { email: '...' } ou null
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur connecté au démarrage
  useEffect(() => {
    const storedUser = getCurrentUser();

    if (storedUser && storedUser.email) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#f0f0f0" }}>
        Chargement de l'application...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Route de connexion (path="/") */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/todos" replace />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        {/* Route de la liste ToDo (path="/todos") */}
        <Route
          path="/todos"
          element={
            user ? (
              <TodoPage user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Redirection pour les autres routes */}
        <Route
          path="*"
          element={<Navigate to={user ? "/todos" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
