import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Load API Base URL from .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true, // Send cookies
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, { withCredentials: true });
      fetchUserProfile(); // Fetch user after login
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err.response.data.message);
      throw new Error(err.response.data.message);
      
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err.response.data);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err.response.data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
