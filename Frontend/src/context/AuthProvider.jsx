import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  getCachedUser,
} from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCachedUser);
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

    checkAuth();
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
