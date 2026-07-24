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
