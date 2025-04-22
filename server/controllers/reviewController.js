const Review = require("../models/reviewModel");

// create a review
exports.createReview = async (req, res) => {
  try {
    const { bookId, userId, reviewText } = req.body;
    const newReview = await Review.create({
      bookId,
      userId,
      reviewText,
    });
    res.status(201).json({
      success: true,
      meesage: "Coment created successfully",
      data: {
        review: newReview,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reviewText } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { reviewText },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Updated review successfully",
      data: {
        review: updatedReview,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get all reviews for a book
exports.getReviewsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId });
    res.status(200).json({
      success: true,
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
