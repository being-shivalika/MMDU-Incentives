import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const handleLogout = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("auth:logout", handleLogout);
    checkAuth();

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const login = async (email, password) => {
    setAuthError(null);

    try {
      const loggedInUser = await loginService(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      setAuthError(error.message || "Login failed");
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    loading,
    authError,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
