import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  // Automatically send/receive cookies
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration here
    }
    return Promise.reject(error);
  }
);

export default client;
