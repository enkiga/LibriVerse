// lib/db.js or utils/db.js (create a separate file for clarity)
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URL, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB");
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    cached.promise = null;
    throw err;
  }
}

module.exports = connectToDatabase;
