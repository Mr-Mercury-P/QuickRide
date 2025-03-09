import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

// Define initial state
const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    isRegistered: false,
};

// Define reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
            };
        case "LOGOUT":
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Auth state on mount:", state);
    }, []);

    const login = (token) => {
        dispatch({ type: "LOGIN", payload: { token } });
    };

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
