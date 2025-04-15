// Importing requirements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    profile: {
      bio: String,
      profilePicture: String,
      favoriteGenres: [
        {
          type: Schema.Types.ObjectId,
          ref: "Genre",
        },
      ],
      favoriteBooks: [
        {
          type: Schema.Types.ObjectId,
          ref: "Book",
        },
      ],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", userSchema);
