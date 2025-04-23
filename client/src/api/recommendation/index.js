import client from "../client";

// Create recommendation
export const createRecommendation = async (recommendationData) => {
  try {
    const response = await client.post(
      "/recommendation/create-recommendation",
      recommendationData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//  get user recommendations



