const jwt = require("jsonwebtoken");

// Middleware to protect routes and ensure user authentication
const authGuard = (req, res, next) => {
  // Log incoming request headers for debugging purposes
  console.log(req.headers);

  // Extract the 'authorization' header from the request
  const authHeader = req.headers.authorization;

  // If the 'authorization' header is missing, send an error response
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Authorization header is missing",
    });
  }

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(" ")[1];

  // If the token is not provided or empty, send an error response
  if (!token || token === "") {
    return res.status(400).json({
      success: false,
      message: "Token is missing or empty",
    });
  }

  // Verify the token using JWT and the secret key
  try {
    const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information to the request object (e.g., user id)
    req.user = decodedUserData;

    // Call the next middleware function or controller
    next();
  } catch (error) {
    console.error(error);

    // If token verification fails, send an authentication error
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware to protect routes that require admin privileges
const adminGuard = (req, res, next) => {
  // Log incoming request headers for debugging purposes
  console.log(req.headers);

  // Extract the 'authorization' header from the request
  const authHeader = req.headers.authorization;

  // If the 'authorization' header is missing, send an error response
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Authorization header is missing",
    });
  }

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(" ")[1];

  // If the token is not provided or empty, send an error response
  if (!token || token === "") {
    return res.status(400).json({
      success: false,
      message: "Token is missing or empty",
    });
  }

  // Verify the token using JWT and the secret key
  try {
    const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information to the request object
    req.user = decodedUserData;

    // Check if the user has admin privileges
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    // Call the next middleware function or controller
    next();
  } catch (error) {
    console.error(error);

    // If token verification fails, send an authentication error
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  authGuard,
  adminGuard,
};
