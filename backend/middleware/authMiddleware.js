const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request
      db.query(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [decoded.id],
        (err, results) => {
          if (err || results.length === 0) {
            return res
              .status(401)
              .json({ message: "Not authorized, user not found" });
          }
          req.user = results[0];
          next();
        }
      );
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "User role not authorized" });
    }
    next();
  };
};

module.exports = { protect, authorize };
