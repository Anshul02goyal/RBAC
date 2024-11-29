const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    // Check if authorization header is provided
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Authentication token is missing" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the decoded id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    // Attach user information to the request object for further use
    req.user = {
      id: user._id,
      role: user.role,
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle various errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    // General error handler
    res.status(500).json({
      message: "Authentication failed",
      error: error.message || "Something went wrong during authentication",
    });
  }
};

module.exports = authenticate;
