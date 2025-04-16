const { signUpSchema, signInSchema } = require("../middlewares/validator");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { doHash, doHashValidation } = require("../utils/hashing");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const { error, value } = signUpSchema.validate({
      email,
      password,
      username,
    });

    // Error handling
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User Already Exist",
      });
    }

    // username
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(401).json({
        success: false,
        message: "Username Already Exist",
      });
    }

    // Password handling
    const hashedPassword = await doHash(password, 12);

    // Store new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });

    const result = await newUser.save();
    result.password = undefined; // So as to not to send the hashed password

    res.status(201).json({
      success: true,
      message: `Your account for ${result.email} has been created successfully`,
      result,
    });
  } catch (error) {
    console.log("Authentication error", error);
    return res.status(501).json({
      success: false,
      message: `Server Authenntication error ${error}!`,
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error, value } = signInSchema.validate({ email, password });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Query DB
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Password comparison
    const result = await doHashValidation(password, existingUser.password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res
      .cookie("Authorization", `Bearer ${token}`, {
        httpOnly: true, // Prevent XSS
        secure: process.env.NODE_ENV === "production", // HTTPS only
        sameSite: "strict", // Prevent CSRF
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        path: "/",
      })
      .json({
        success: true,
        token,
        message: "Logged in successfully",
      });
  } catch (error) {
    console.log("Sign In Error", error);
  }
};

exports.signout = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

exports.getCurrentUser = async (req, res) => {
  try {
    // User is already set in the request by the identifier middleware
    const user = await User.findById(req.user.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Get Current User Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};
