const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// ✅ Get dashboard stats
// GET /api/admin/stats
// Private/Admin
const getDashboardStats = (req, res) => {
  const stats = {};
  const q1 = "SELECT COUNT(*) as totalUsers FROM users";
  const q2 = "SELECT COUNT(*) as totalStores FROM stores";
  const q3 = "SELECT COUNT(*) as totalRatings FROM ratings";

  db.query(q1, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    stats.totalUsers = results[0].totalUsers;

    db.query(q2, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      stats.totalStores = results[0].totalStores;

      db.query(q3, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }
        stats.totalRatings = results[0].totalRatings;

        res.json(stats);
      });
    });
  });
};

// ✅ Create new user (Admin only)
// POST /api/admin/users
// Private/Admin
const createUser = (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "Please provide name, email, password, and role",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const userId = uuidv4();

  const sql =
    "INSERT INTO users (id, name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [userId, name, email, hashedPassword, address, role],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "User with this email already exists" });
        }
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "User created successfully",
        id: userId,
      });
    }
  );
};

// ✅ Get all users with optional filters
// GET /api/admin/users
// Private/Admin
const getUsers = (req, res) => {
  const { name, email, address, role } = req.query;

  let sql = "SELECT id, name, email, address, role FROM users WHERE 1=1";
  const params = [];

  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    sql += " AND email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    sql += " AND address LIKE ?";
    params.push(`%${address}%`);
  }
  if (role) {
    sql += " AND role = ?";
    params.push(role);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// ✅ Get store owners
// GET /api/admin/store-owners
// Private/Admin
const getStoreOwners = (req, res) => {
  const sql = `
    SELECT id, name, email, address 
    FROM users 
    WHERE role = 'Store Owner' 
    ORDER BY name`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error on getStoreOwners:", err);
      return res.status(500).json({ message: "Failed to get store owners." });
    }
    res.json(results);
  });
};

module.exports = {
  getDashboardStats,
  createUser,
  getUsers,
  getStoreOwners,
};
