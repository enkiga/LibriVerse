import client from "../client";

export const signup = async (userData) => {
  try {
    const response = await client.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const signin = async (credentials) => {
  try {
    const response = await client.post("/auth/signin", credentials);
    // Store token in localStorage if needed
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const signout = async () => {
  try {
    const response = await client.post("/auth/signout");
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const authStatus = async () => {
  try {
    const response = await client.get("/auth/status");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
