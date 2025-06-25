import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  // This is the key. It tells the browser to automatically send the
  // secure httpOnly cookie with every request to this domain.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REMOVED: The request interceptor that manually added the token from localStorage.
// It is no longer needed because the browser handles the cookie automatically.

// The response interceptor is still useful for global error handling.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, it means the cookie is invalid or expired.
    // We can trigger a global logout event from here.
    if (error.response?.status === 401) {
      // For example, you could redirect to the login page.
      // window.location.href = '/login';
      console.error("Authentication Error: Session may be expired.");
    }
    return Promise.reject(error);
  }
);

export default client;
