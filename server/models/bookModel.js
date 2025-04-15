// Importing requirements
const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    isbn: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    description: String,
    coverImage: String,
    genre: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    publishedDate: Date,
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamp: true,
  }
);
