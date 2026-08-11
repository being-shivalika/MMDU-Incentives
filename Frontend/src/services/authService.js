import apiClient, {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from "./api";

const USER_KEY = "rpms-user";

export const login = async (email, password) => {
  const data = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.success && data.token) {
    setStoredToken(data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data.user;
};

export const logout = () => {
  removeStoredToken();
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = async () => {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const data = await apiClient("/auth/me");
    if (data.success && data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch (error) {
    // Token invalid/expired
    removeStoredToken();
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

// Get cached user from localStorage (synchronous, for initial render)
export const getCachedUser = () => {
  const token = getStoredToken();
  if (!token) return null;

  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Request password reset OTP
export const requestForgotPassword = async (email) => {
  return await apiClient("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// Reset password using OTP
export const submitResetPassword = async (email, token, newPassword) => {
  return await apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, token, newPassword }),
  });
};

// Change password on first login
export const changeFirstPassword = async (newPassword) => {
  const data = await apiClient("/auth/change-first-password", {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });

  if (data.success && data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data.user;
};
