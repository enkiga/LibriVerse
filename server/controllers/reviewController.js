const Review = require("../models/reviewModel");

// create a review
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;

    // check if user has already reviewed the book
    const existingReview = await Review.findOne({
      user: req.user.userId,
      book: bookId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      });
    }

    const newReview = await Review.create({
      user: req.user.userId,
      book: bookId,
      reviewText,
      rating,
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
    const { reviewText, rating } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { reviewText, rating },
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
    const { book } = req.params;
    //
    const reviews = await Review.find({ book })
      .populate("user", "username email")
      .populate("book", "title author googleBooksId");
    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this book",
      });
    }

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
