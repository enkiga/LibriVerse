// Connecting .env file
require("dotenv").config();

// Importing requirements
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectToDatabase = require("./utils/dbConnect");

const authRouter = require("./routers/authRouter");
const bookRouter = require("./routers/bookRouter");
const recommendationRouter = require("./routers/recommendationRouter");
const commentRouter = require("./routers/commentRouter");
const reviewRouter = require("./routers/reviewRouter");

// Setting up express
const app = express();
app.use(express.json());

// Parsing cookies
app.use(cookieParser());

// Allowing all origins
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.set("trust proxy", 1); // Trust first proxy for secure cookies

// Assign port value with fallback
const port = process.env.PORT || 8000;

// Connecting to MongoDB
(async () => {
  try {
    await connectToDatabase();
    console.log("MongoDB is ready");
  } catch (error) {
    console.error("MongoDB failed to connect", error);
  }
})();

// Check DB disconnection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);
app.use("/api/recommendation", recommendationRouter);
app.use("/api/comment", commentRouter);
app.use("/api/review", reviewRouter);

// Test to see if server is running
app.get("/", (req, res) => {
  res.json({ message: "LibriVerse Server de run now..." });
});

// Listening to the connection
app.listen(port, () => {
  console.log("listening...");
});
