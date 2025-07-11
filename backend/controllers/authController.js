const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const userId = uuidv4();

      db.query(
        "INSERT INTO users (id, name, email, password_hash, address) VALUES (?, ?, ?, ?, ?)",
        [userId, name, email, hashedPassword, address],
        (err, result) => {
          if (err) throw err;
          res.status(201).json({
            id: userId,
            name,
            email,
            role: "user",
            token: generateToken(userId, "user"),
          });
        }
      );
    }
  );
};



// @desc    Register a new admin
// @route   POST /api/auth/register/admin
// @access  Public (should be protected in production)
const registerAdmin = (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  db.query(
    "SELECT email FROM admin WHERE email = ?",
    [email],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const adminId = uuidv4();

      db.query(
        "INSERT INTO admin (name, email, password, address) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, address],
        (err, result) => {
          if (err) throw err;
          res.status(201).json({
            id: result.insertId, // this is the AUTO_INCREMENT id
            name,
            email,
            address,
            token: generateToken(result.insertId),
          });
        }
      );
    }
  );
};

// @desc    Register a new store owner
// @route   POST /api/auth/register/owner
// @access  Public
const registerOwner = (req, res) => {
  registerWithRole(req, res, "Store Owner");
};

// Generic login function
const loginWithRole = (req, res, role, tableName) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  db.query(
    `SELECT * FROM ${tableName} WHERE email = ?`,
    [email],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      const isMatch = bcrypt.compareSync(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
        token: generateToken(user.id, role),
      });
    }
  );
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => {
  loginWithRole(req, res, "user", "users");
};

// @desc    Authenticate an admin
// @route   POST /api/auth/login/admin
// @access  Public
const loginAdmin = (req, res) => {
  loginWithRole(req, res, "admin");
};

// @desc    Authenticate a store owner
// @route   POST /api/auth/login/owner
// @access  Public
const loginOwner = (req, res) => {
  loginWithRole(req, res, "Store Owner", "owners");
};

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide old and new passwords" });
  }

  db.query(
    "SELECT password_hash FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      const isMatch = bcrypt.compareSync(oldPassword, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      const salt = bcrypt.genSaltSync(10);
      const newHashedPassword = bcrypt.hashSync(newPassword, salt);

      db.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [newHashedPassword, userId],
        (err, result) => {
          if (err) throw err;
          res.json({ message: "Password updated successfully" });
        }
      );
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  registerAdmin,
  registerOwner,
  loginAdmin,
  loginOwner,
};
