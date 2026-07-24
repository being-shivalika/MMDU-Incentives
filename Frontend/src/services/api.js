const TOKEN_KEY = "rpms-token";

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

  const response = await fetch(`/api${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // If token is expired/invalid, clear it
    if (response.status === 401) {
      removeStoredToken();
      localStorage.removeItem("rpms-user");
    }
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default apiClient;
