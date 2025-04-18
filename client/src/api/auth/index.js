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
    const response = await client.post("/auth/signin", credentials, {
      withCredentials: true, // Required for cookies
    });

    // No client-side token storage needed
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const signout = async () => {
  try {
    await client.post("/auth/signout");
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await client.get("/auth/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
