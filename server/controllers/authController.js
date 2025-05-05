const { signUpSchema, signInSchema } = require("../middlewares/validator");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Recommendation = require("../models/recommendationModel");
const Review = require("../models/reviewModel");
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

exports.addFavorite = async (req, res) => {
  const { bookId } = req.body;
  try {
    // Check if the bookId is provided
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // Add the bookId to the user's favorites array found in user/profile/favoriteBooks
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { "profile.favoriteBooks": bookId } },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("profile.favoriteBooks");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book added to favorites",
      user,
    });
  } catch (error) {
    console.log("Add Favorite Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};

// remove from favorites
exports.removeFavorite = async (req, res) => {
  const { bookId } = req.body;
  try {
    // Check if the bookId is provided
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // Remove the bookId from the user's favorites array found in user/profile/favoriteBooks
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { "profile.favoriteBooks": bookId } },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("profile.favoriteBooks");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book removed from favorites",
      user,
    });
  } catch (error) {
    console.log("Remove Favorite Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};

// get all favourite books
exports.getAllFavourites = async (req, res) => {
  try {
    // User is already set in the request by the identifier middleware
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("profile.favoriteBooks");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      books: user.profile.favoriteBooks,
    });
  } catch (error) {
    console.log("Get All Favourites Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};

exports.followUser = async (req, res) => {
  const { UserId } = req.params;
  try {
    // Check if the UserId is provided
    if (!UserId) {
      return res.status(400).json({
        success: false,
        message: "User ID to follow is required",
      });
    }

    // Add the UserId to the user's following array
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { following: UserId } },
      { new: true, runValidators: true }
    ).select("-password");

    // Update the followed user's followers array
    await User.findByIdAndUpdate(
      UserId,
      { $addToSet: { followers: req.user.userId } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User followed successfully",
      user,
    });
  } catch (error) {
    console.log("Follow User Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};

exports.unfollowUser = async (req, res) => {
  const { UserId } = req.params;
  try {
    // Check if the UserId is provided
    if (!UserId) {
      return res.status(400).json({
        success: false,
        message: "User ID to unfollow is required",
      });
    }

    // Remove the UserId from the user's following array
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { following: UserId } },
      { new: true, runValidators: true }
    ).select("-password");

    // Update the unfollowed user's followers array
    await User.findByIdAndUpdate(
      UserId,
      { $pull: { followers: req.user.userId } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      user,
    });
  } catch (error) {
    console.log("Unfollow User Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};

// get user by id and return user data
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch user and convert to plain object using .lean()
    const user = await User.findById(userId)
      .select("-password")
      .populate(
        "profile.favoriteBooks",
        "title author coverImage googleBooksId"
      )
      .populate("followers", "username")
      .populate("following", "username")
      .lean(); // Convert to plain object

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch recommendations and reviews
    const userRecommendations = await Recommendation.find({ user: userId })
      .select("-user")
      .populate("book", "title author coverImage googleBooksId")
      .populate("likes", "username");

    const userReviews = await Review.find({ user: userId })
      .select("-user")
      .populate("book", "title author coverImage");

    // Add recommendations and reviews to the user object
    user.recommendations = userRecommendations;
    user.reviews = userReviews;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("Get User By ID Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};

// Implement a suggestion algorithm that suggests books to users based on their preferences and interactions.
exports.suggestBooks = async (req, res) => {
  try {
    // Fetch all users and their favorite books
    const users = await User.find()
      .select("profile.favoriteBooks")
      .populate(
        "profile.favoriteBooks",
        "title author coverImage googleBooksId"
      );

    // Create a map to store book suggestions
    const bookSuggestions = {};

    // Iterate through each user and their favorite books
    users.forEach((user) => {
      user.profile.favoriteBooks.forEach((book) => {
        if (!bookSuggestions[book._id]) {
          bookSuggestions[book._id] = {
            id: book._id,
            title: book.title,
            author: book.author,
            coverImage: book.coverImage,
            googleBooksId: book.googleBooksId,
          };
        }
      });
    });

    const bookSuggestionsArray = Object.values(bookSuggestions);

    res.status(200).json({
      success: true,
      data: bookSuggestionsArray,
    });
  } catch (error) {
    console.log("Suggest Books Error", error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error}`,
    });
  }
};
