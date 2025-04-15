const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
  let token;
  if (req.headers.client === "not-browser") {
    token = req.header.authorization;
  } else {
    token = req.cookies["Authorization"];
  }

  if (!token) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const userToken = token.split(" ")[1];
    const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);

    if (jwtVerified) {
      req.user = jwtVerified;
      next();
    } else {
      throw new Error("Error in the token");
    }
  } catch (error) {
    console.log(`Identification error: ${error}`);
    return res
      .status(501)
      .json({ success: false, message: `Identification error: ${error}` });
  }
};
