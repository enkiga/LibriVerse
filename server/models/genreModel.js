const mongoose = require("mongoose");

const genreSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Genre", genreSchema)
