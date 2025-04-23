import client from "../client";

export const createReview = async (reviewData) => {
  try {
    const response = await client.post("/review/create-review", reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// get all reviews for a book
export const getReviewsForBook = async (bookId) => {
  try {
    const response = await client.get("/review/view-review", bookId);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
