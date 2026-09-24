import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 and try refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        const refreshUrl = `${API_BASE_URL.replace(/\/$/, "")}/token/refresh/`;
        const { data } = await axios.post(refreshUrl, { refresh });

        localStorage.setItem("access", data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);

      } catch {
        // Refresh failed → clear storage and redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;