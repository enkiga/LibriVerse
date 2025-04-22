const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who posted the comment
      required: true,
    },
    recommendation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation", // Reference to the recommendation the comment belongs to
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
