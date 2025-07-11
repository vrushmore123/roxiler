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

      // ✅ Debug: show what you decoded
      console.log("Decoded JWT:", decoded);

      // ✅ Determine correct table
      let tableName;
      if (decoded.role === "admin") {
        tableName = "admins";
      } else if (decoded.role === "Store Owner") {
        tableName = "owner"; // ✅ FIXED: matches your actual table name
      } else {
        tableName = "users";
      }

      console.log("Querying table:", tableName);

      // ✅ Fetch user
      db.query(
        `SELECT id, name, email FROM ${tableName} WHERE id = ?`,
        [decoded.id],
        (err, results) => {
          if (err) {
            console.error("DB error in protect middleware:", err);
            return res
              .status(500)
              .json({ message: "Database error in protect middleware" });
          }

          if (results.length === 0) {
            return res
              .status(401)
              .json({ message: "Not authorized, user not found" });
          }

          req.user = { ...results[0], role: decoded.role };
          console.log("req.user set to:", req.user);
          next();
        }
      );
    } catch (error) {
      console.error("JWT verify failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
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
