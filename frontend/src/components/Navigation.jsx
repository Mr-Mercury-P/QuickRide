import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navigation = () => {
    const { state, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const navStyles = {
        backgroundColor: "#1E3A8A",
        padding: "1rem 2rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "4rem",
        position: "relative",
    };

    const linkStyles = {
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        color: "white",
        textDecoration: "none",
        fontSize: "1rem",
        transition: "background 0.3s ease",
        display: "flex",
        alignItems: "center",
    };

    const buttonStyles = {
        backgroundColor: "#F59E0B",
        padding: "0.4rem 0.8rem",
        borderRadius: "0.5rem",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "0.9rem",
        transition: "background 0.3s ease",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
    };

    const menuStyles = {
        display: menuOpen ? "flex" : "none",
        flexDirection: "column",
        position: "absolute",
        top: "100%",
        right: "0",
        backgroundColor: "#1E3A8A",
        padding: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.5rem",
        width: "200px",
    };

    return (
        <nav style={navStyles}>
            <Link to="/" style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", textDecoration: "none" }}>
                Car Rental
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}>
                ☰
            </button>
            <ul style={menuStyles}>
                <li>
                    <Link to="/" style={linkStyles} onClick={() => setMenuOpen(false)}>Home</Link>
                </li>
                {state.isAuthenticated ? (
                    <>
                        <li>
                            <Link to="/cars" style={linkStyles} onClick={() => setMenuOpen(false)}>Available Cars</Link>
                        </li>
                        <li>
                            <Link to="/my-cars" style={linkStyles} onClick={() => setMenuOpen(false)}>Your Cars</Link>
                        </li>
                        <li>
                            <Link to="/rent-my-car" style={linkStyles} onClick={() => setMenuOpen(false)}>Add Car</Link>
                        </li>
                        <li>
                            <button 
                                onClick={logout} 
                                style={buttonStyles}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#D97706")} 
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#F59E0B")}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/register" style={linkStyles} onClick={() => setMenuOpen(false)}>Register</Link>
                        </li>
                        <li>
                            <Link to="/login" style={linkStyles} onClick={() => setMenuOpen(false)}>Login</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;