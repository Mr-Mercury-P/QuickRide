import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post("https://quickride.onrender.com/api/auth/login", formData)
      .then((res) => {
        if (res.status === 200) {
          login(res.data.token);
          navigate("/");
        }
      })
      .catch((err) => console.error("Login error", err));
  };

  const containerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#F3F4F6",
    padding: "1rem",
  };

  const formStyles = {
    backgroundColor: "#FFFFFF",
    padding: "2rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const inputStyles = {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #D1D5DB",
    fontSize: "1rem",
    width: "100%",
  };

  const buttonStyles = {
    backgroundColor: "#1E3A8A",
    color: "white",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.3s ease",
    width: "100%",
    textAlign: "center",
  };

  return (
    <div style={containerStyles}>
      <div style={formStyles}>
        <h2 style={{ textAlign: "center", color: "#1E3A8A" }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required style={inputStyles} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={inputStyles} />
          <button type="submit" style={buttonStyles}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
