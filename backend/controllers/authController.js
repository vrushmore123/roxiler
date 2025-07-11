const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ Register a new normal user
const registerUser = (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  db.query("SELECT email FROM users WHERE email = ?", [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userId = uuidv4();

    db.query(
      "INSERT INTO users (id, name, email, password, address) VALUES (?, ?, ?, ?, ?)",
      [userId, name, email, hashedPassword, address],
      (err) => {
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
  });
};

// ✅ Register an admin
const registerAdmin = (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  db.query("SELECT email FROM admin WHERE email = ?", [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const adminId = uuidv4();

    db.query(
      "INSERT INTO admin (id, name, email, password, address) VALUES (?, ?, ?, ?, ?)",
      [adminId, name, email, hashedPassword, address],
      (err) => {
        if (err) throw err;
        res.status(201).json({
          id: adminId,
          name,
          email,
          role: "admin",
          token: generateToken(adminId, "admin"),
        });
      }
    );
  });
};

// ✅ Register an owner
const registerOwner = (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  db.query("SELECT email FROM owner WHERE email = ?", [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const ownerId = uuidv4();

    db.query(
      "INSERT INTO owner (id, name, email, password, address) VALUES (?, ?, ?, ?, ?)",
      [ownerId, name, email, hashedPassword, address],
      (err) => {
        if (err) throw err;
        res.status(201).json({
          id: ownerId,
          name,
          email,
          role: "Store Owner",
          token: generateToken(ownerId, "Store Owner"),
        });
      }
    );
  });
};

// ✅ Generic login function — safe table binding
const loginWithRole = (req, res, role, tableName) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  if (!tableName) {
    return res.status(500).json({ message: "Table name is undefined." });
  }

  db.query(
    "SELECT * FROM ?? WHERE email = ?",
    [tableName, email],
    (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      const isMatch = bcrypt.compareSync(password, user.password);

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

// ✅ Login for each type
const loginUser = (req, res) => {
  loginWithRole(req, res, "user", "users");
};

const loginAdmin = (req, res) => {
  loginWithRole(req, res, "admin", "admin");
};

const loginOwner = (req, res) => {
  loginWithRole(req, res, "Store Owner", "owner");
};

// ✅ Update password — with correct table check
const updatePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide old and new passwords" });
  }

  let tableName;
  if (userRole === "admin") {
    tableName = "admin";
  } else if (userRole === "Store Owner") {
    tableName = "owner";
  } else {
    tableName = "users";
  }

  db.query(`SELECT password FROM ?? WHERE id = ?`, [tableName, userId], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHashedPassword = bcrypt.hashSync(newPassword, salt);

    db.query(`UPDATE ?? SET password = ? WHERE id = ?`, [tableName, newHashedPassword, userId], (err) => {
      if (err) throw err;
      res.json({ message: "Password updated successfully" });
    });
  });
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
