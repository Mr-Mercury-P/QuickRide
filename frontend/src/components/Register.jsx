import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", mobile: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/api/auth/signup", formData)
      .then((res) => {
        login(res.data.token);
        navigate("/");
      })
      .catch((err) => console.error(err));
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
        <h2 style={{ textAlign: "center", color: "#1E3A8A" }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          {[{ name: "username", type: "text", placeholder: "Username" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "password", type: "password", placeholder: "Password" },
            { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
            { name: "mobile", type: "text", placeholder: "Mobile Number" }].map(({ name, type, placeholder }) => (
            <input key={name} type={type} name={name} placeholder={placeholder} value={formData[name]} onChange={handleChange} required style={inputStyles} />
          ))}
          <button type="submit" style={buttonStyles}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;