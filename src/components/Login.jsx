// src/components/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../auth"; // Import de registerUser

function Login({ setUser }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false); // Nouvel état pour l'inscription

  const handleLogin = (e) => {
    e.preventDefault();

    const user = loginUser(email, password);

    if (user) {
      setUser({ email: user.email });
      navigate("/todos");
    } else {
      alert("Invalid email or password");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const newUser = registerUser({ email, password });

    if (newUser) {
        alert("Registration successful! You can now log in.");
        setIsRegistering(false); // Retourner à l'écran de connexion
        setEmail("");
        setPassword("");
    } else {
        alert("Registration failed. This email may already exist.");
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>

      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{isRegistering ? "Sign Up" : "Login"}</button>
      </form>
      
      <div className="login-switch">
        <p>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
        </p>
        <button 
            className="switch-btn"
            onClick={() => setIsRegistering(!isRegistering)}
        >
            {isRegistering ? "Login" : "Sign Up"}
        </button>
      </div>

    </div>
  );
}

export default Login;