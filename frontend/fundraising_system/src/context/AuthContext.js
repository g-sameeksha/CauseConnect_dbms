import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [organization, setOrganization] = useState(null);
  const BASE_URL = 'http://127.0.0.1:8000';
  const smallMultiplier = 10;
  const  bigMultiplier = 100
     

  // Function to check authentication from localStorage
  const handleAuth = () => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_date = Date.now() / 1000;

        if (expiry_date >= current_date) {
          setIsAuthenticated(true);

          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) {
            setUser(storedUser);
            setRole(storedUser.role);
            setOrganization(storedUser.organization || null);
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  };

  // Login function
  const login = async (email, password, role, organization) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
        role,
        organization: organization === "" ? null : organization,
      });

      const userData = {
        email: res.data.email,
        name: res.data.name,
        role: res.data.role,
        organization: res.data.organization, // Store organization if available
      };

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setRole(res.data.role);
      setOrganization(res.data.organization || null);
      setIsAuthenticated(true);

      return res.data.role;
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.response?.data?.detail || "Login failed");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    
    setUser(null);
    setRole(null);
    setOrganization(null);
    setIsAuthenticated(false);

  };

  // Run on component mount to check authentication
  useEffect(() => {
    handleAuth();
  }, []);

  const authValue = {
    isAuthenticated,
    user,
    role,
    organization,
    handleLogout,
    login,
    BASE_URL ,
    smallMultiplier,
    bigMultiplier,

  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}
