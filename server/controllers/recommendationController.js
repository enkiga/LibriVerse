const Recommendation = require("../models/recommendationModel");

exports.createRecommendation = async (req, res) => {
  const { bookId, recommendationText } = req.body;

  try {
    // Check if the bookId and recommendationText are provided
    if (!bookId || !recommendationText) {
      return res.status(400).json({
        success: false,
        message: "Book ID and recommendation text are required",
      });
    }

    // Create a new recommendation
    const recommendation = new Recommendation({
      user: req.user.userId,
      book: bookId,
      recommendationText,
    });

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: "Recommendation created successfully",
      recommendation,
    });
  } catch (error) {
    console.error("Error creating recommendation:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.userRecommendation = async (req, res) => {
  try {
    // Fetch recommendations for the current user
    const recommendations = await Recommendation.find({
      userId: req.user.userId,
    }).populate("bookId", "title author coverImage");

    res.status(200).json({
      success: true,
      message: "Recommendations fetched successfully",
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deleteRecommendation = async (req, res) => {
  const { recommendationId } = req.params;

  try {
    // Check if the recommendationId is provided
    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: "Recommendation ID is required",
      });
    }

    // Delete the recommendation
    const deletedRecommendation =
      await Recommendation.findByIdAndDelete(recommendationId);

    if (!deletedRecommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recommendation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recommendation:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.updateRecommendation = async (req, res) => {
  const { recommendationId } = req.params;
  const { recommendationText } = req.body;

  try {
    // Check if the recommendationId and recommendationText are provided
    if (!recommendationId || !recommendationText) {
      return res.status(400).json({
        success: false,
        message: "Recommendation ID and text are required",
      });
    }

    // Update the recommendation
    const updatedRecommendation = await Recommendation.findByIdAndUpdate(
      recommendationId,
      { recommendationText },
      { new: true }
    );

    if (!updatedRecommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recommendation updated successfully",
      updatedRecommendation,
    });
  } catch (error) {
    console.error("Error updating recommendation:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.likeRecommendation = async (req, res) => {
  const { recommendationId } = req.params;

  try {
    // Check if the recommendationId is provided
    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: "Recommendation ID is required",
      });
    }

    // Like the recommendation
    const recommendation = await Recommendation.findById(recommendationId);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found",
      });
    }

    // Check if the user has already liked the recommendation
    const alreadyLiked = recommendation.likes.includes(req.user.userId);

    if (alreadyLiked) {
      // Unlike the recommendation
      recommendation.likes.pull(req.user.userId);
    } else {
      // Like the recommendation
      recommendation.likes.push(req.user.userId);
    }

    await recommendation.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Recommendation unliked" : "Recommendation liked",
      likesCount: recommendation.likes.length,
    });
  } catch (error) {
    console.error("Error liking/unliking recommendation:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get 5 most liked recommendations
exports.getTopRecommendations = async (req, res) => {
  try {
    // Fetch the top 5 most liked recommendations
    const recommendations = await Recommendation.find()
      .sort({ likes: -1 })
      .limit(5)
      .populate("bookId", "title author coverImage");

    res.status(200).json({
      success: true,
      message: "Top recommendations fetched successfully",
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching top recommendations:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get 5 most recent recommendations
exports.getRecentRecommendations = async (req, res) => {
  try {
    // Fetch the 5 most recent recommendations
    const recommendations = await Recommendation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("bookId", "title author coverImage");

    res.status(200).json({
      success: true,
      message: "Recent recommendations fetched successfully",
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching recent recommendations:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get all recommendations for a book
exports.getBookRecommendations = async (req, res) => {
  const { bookId } = req.params;

  try {
    // Check if the bookId is provided
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // Fetch recommendations for the specified book
    const recommendations = await Recommendation.find({ bookId })
      .populate("userId", "username")
      .populate("bookId", "title author coverImage");

    res.status(200).json({
      success: true,
      message: "Recommendations for the book fetched successfully",
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching book recommendations:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get all recommendations for a user
exports.getUserRecommendations = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch recommendations for the specified user
    const recommendations = await Recommendation.find({ userId })
      .populate("bookId", "title author coverImage")
      .populate("userId", "username");

    res.status(200).json({
      success: true,
      message: "Recommendations for the user fetched successfully",
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching user recommendations:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get all recommendations
exports.getAllRecommendations = async (req, res) => {
  try {
    // Fetch all recommendations
    const recommendations = await Recommendation.find()
      .populate("bookId", "title author coverImage")
      .populate("userId", "username");

    res.status(200).json({
      success: true,
      message: "All recommendations fetched successfully",
      recommendations,
    });
  } catch (error) {
    console.error("Error fetching all recommendations:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
