// Importing requirements
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    googleBooksId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    author: [
      {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
    ],
    publisher: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: String,
    coverImage: String,
    publishedDate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
