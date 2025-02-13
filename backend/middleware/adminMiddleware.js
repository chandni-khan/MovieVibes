const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("-------------",decoded)
    // Check if user has admin role (assuming 'role' is stored in token)
    if (decoded.role !== 1) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });
    }

    // Attach user info to request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = isAdmin;
