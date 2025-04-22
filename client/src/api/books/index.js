// Use axios to get the books from the GOOGLE BOOK API
import axios from "axios";
import client from "../client";

const booksApi = axios.create({
  baseURL: "https://www.googleapis.com/books/v1/volumes",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include API key
booksApi.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    config.params = { ...config.params, key: apiKey };
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
booksApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("API key is invalid or quota exceeded.");
    } else if (error.response?.status === 404) {
      console.error("Resource not found.");
    } else {
      console.error("An unexpected error occurred:", error.message);
    }
    return Promise.reject(error);
  }
);

const getBooks = async (page, limit, query) => {
  try {
    const response = await booksApi.get("/", {
      params: {
        q: query,
        startIndex: (page - 1) * limit,
        maxResults: limit,
      },
    });
    return response.data.items || [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// get a book by id from client
const getBookById = async (googleBooksId) => {
  try {
    const response = await client.get("book/get-book", {
      params: { googleBooksId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// export all functions
export { getBooks, getBookById };
