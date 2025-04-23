const comment = require("../models/commentModel");

exports.createComment = async (req, res) => {
  const { bookId, commentText } = req.body;

  try {
    // Check if the bookId and commentText are provided
    if (!bookId || !commentText) {
      return res.status(400).json({
        success: false,
        message: "Book ID and comment text are required",
      });
    }

    // check if user has already commented on the book
    const existingComment = await comment.findOne({
      userId: req.user.userId,
      bookId,
    });

    if (existingComment) {
      return res.status(400).json({
        success: false,
        message: "You have already commented on this book",
      });
    }

    // Create a new comment
    const comment = new comment({
      userId: req.user.userId,
      bookId,
      commentText,
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { commentText } = req.body;

  try {
    // Check if the commentId and commentText are provided
    if (!commentId || !commentText) {
      return res.status(400).json({
        success: false,
        message: "Comment ID and comment text are required",
      });
    }

    // Update the comment
    const updatedComment = await comment.findByIdAndUpdate(
      commentId,
      { commentText },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Check if the commentId is provided
    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required",
      });
    }

    // Delete the comment
    const deletedComment = await comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      deletedComment,
    });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.viewComments = async (req, res) => {
  const { bookId } = req.params;

  try {
    // Check if the bookId is provided
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // Fetch comments for the specified book
    const comments = await comment.find({ bookId }).populate("userId", "name");

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
