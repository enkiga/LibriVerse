// Connecting .env file
require("dotenv").config();

// Importing requirements
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routers/authRouter");

// Setting up express
const app = express();
app.use(express.json());

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

// Test to see if server is running
app.get("/", (req, res) => {
  res.json({ message: "LibriVerse Server de run now..." });
});

// Listening to the connection
app.listen(port, () => {
  console.log("listening...");
});
