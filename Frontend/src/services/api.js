const TOKEN_KEY = "rpms-token";

const API_URL = import.meta.env.VITE_API_URL;

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeStoredToken = () => localStorage.removeItem(TOKEN_KEY);

const apiClient = async (endpoint, options = {}) => {
  const token = getStoredToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}/api${endpoint}`, config);

  let data = {};

  try {
    data = await response.json();
  } catch {
    // Handle empty or non-JSON responses gracefully
  }

  if (!response.ok) {
    // If token is expired/invalid, clear it
    if (response.status === 401) {
      removeStoredToken();
      localStorage.removeItem("rpms-user");
      window.dispatchEvent(new Event("auth:logout"));
    }

    console.error("Status:", response.status);
    console.error("Response:", data);

    throw new Error(
      data.message || `HTTP ${response.status} ${response.statusText}`,
    );
  }

  return data;
};

export default apiClient;
