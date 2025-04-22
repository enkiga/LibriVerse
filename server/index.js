// Connecting .env file
require("dotenv").config();

// Importing requirements
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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

// Assign port value with fallback
const port = process.env.PORT || 8000;

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(`MondoDB error ${err}`);
  });

app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);
app.use("/api/recommendation", recommendationRouter);
app.use("api/comment", commentRouter);
app.use("/api/review", reviewRouter);

// Test to see if server is running
app.get("/", (req, res) => {
  res.json({ message: "LibriVerse Server de run now..." });
});

// Listening to the connection
app.listen(port, () => {
  console.log("listening...");
});
