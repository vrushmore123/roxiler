const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// @desc    Submit a rating for a store
// @route   POST /api/ratings
// @access  Private
const submitRating = (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  if (!store_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Please provide a valid store ID and a rating between 1 and 5.",
    });
  }

  // Using INSERT ... ON DUPLICATE KEY UPDATE to handle new vs. existing ratings
  const ratingId = uuidv4(); // Generate a random unique ID for the rating
  const sql =
    "INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)";

  db.query(sql, [ratingId, user_id, store_id, rating], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Rating submitted successfully" });
  });
};

module.exports = {
  submitRating,
};
