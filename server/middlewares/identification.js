const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
  try {
    let token;

    // Handle both browser and non-browser clients safely
    if (req.headers?.client === "not-browser") {
      // Handle API clients with Authorization header
      token = req.headers?.authorization;
    } else {
      // Handle browser clients with cookies
      token = req.cookies?.Authorization;
    }

    // Validate token existence
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authorization token required" 
      });
    }

    // Extract token from "Bearer" format
    const [bearer, userToken] = token.split(" ");
    
    if (bearer !== "Bearer" || !userToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    }

    // Verify JWT
    const decoded = jwt.verify(userToken, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    console.error("Authentication error:", error.message);
    
    // Clear invalid cookie for browser clients
    if (!req.headers?.client === "not-browser") {
      res.clearCookie("Authorization");
    }

    return res.status(401).json({
      success: false,
      message: error.expiredAt ? "Session expired" : "Invalid authentication token"
    });
  }
};