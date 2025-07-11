const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// ✅ GET all stores (Public)
// @route   GET /api/stores
const getStores = (req, res) => {
  db.query("SELECT * FROM stores", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.json(results);
  });
};

// ✅ CREATE a store (Admin)
// @route   POST /api/stores
const createStore = (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || !email || !address || !owner_id) {
    return res.status(400).json({
      message: "Name, email, address, and owner ID are required.",
    });
  }

  // The check for an existing owner is removed to allow generated IDs.
  // In a real-world app, you would ensure this ID is valid.

  // 🔍 Optional: check for duplicate store email
  db.query("SELECT id FROM stores WHERE email = ?", [email], (err, stores) => {
    if (err) {
      console.error("Error checking store email:", err);
      return res
        .status(500)
        .json({ message: "Database error when checking store email." });
    }

    if (stores.length > 0) {
      return res
        .status(400)
        .json({ message: "A store with this email already exists." });
    }

    // ✅ Insert the store
    const storeId = uuidv4(); // Generate a random unique ID for the store
    const sql =
      "INSERT INTO stores (id, name, email, address, owner_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [storeId, name, email, address, owner_id], (err, result) => {
      if (err) {
        console.error("Database error on store creation:", err);
        return res.status(500).json({
          message: "Failed to create store due to a database error.",
        });
      }

      res.status(201).json({
        id: storeId,
        name,
        email,
        address,
        owner_id,
      });
    });
  });
};

// ✅ GET owned store details with ratings for logged-in owner
// @route   GET /api/stores/mystore
const getOwnedStoreDetails = (req, res) => {
  console.log("In getOwnedStoreDetails, req.user:", req.user);

  const ownerId = req.user.id; // ✅ Must be defined by protect

  const storeSql = "SELECT * FROM stores WHERE owner_id = ?";
  db.query(storeSql, [ownerId], (err, stores) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (stores.length === 0) {
      return res
        .status(404)
        .json({ message: "No store found for this owner." });
    }

    const store = stores[0];

    const ratingSql = `
      SELECT AVG(r.rating) as averageRating, COUNT(r.rating) as ratingCount
      FROM ratings r
      WHERE r.store_id = ?
    `;
    db.query(ratingSql, [store.id], (err, ratingResults) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      const ratingInfo = ratingResults[0];

      const ratersSql = `
        SELECT u.name, u.email, r.rating
        FROM users u
        JOIN ratings r ON u.id = r.user_id
        WHERE r.store_id = ?
        ORDER BY r.created_at DESC
      `;
      db.query(ratersSql, [store.id], (err, raters) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error." });
        }

        res.json({
          store,
          averageRating: ratingInfo.averageRating,
          ratingCount: ratingInfo.ratingCount,
          raters,
        });
      });
    });
  });
};

// ✅ GET all stores for the logged-in owner/user (basic, no rating)
// @route   GET /api/stores/my
const getStoresForUser = (req, res) => {
  const ownerId = req.user.id; // ✅ Your auth middleware must set req.user!

  const sql = "SELECT * FROM stores WHERE owner_id = ?";
  db.query(sql, [ownerId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No stores found for this user." });
    }

    res.json(results);
  });
};

// ✅ Export all!
module.exports = {
  getStores,
  createStore,
  getOwnedStoreDetails,
  getStoresForUser,
};
