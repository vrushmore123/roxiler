const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  createUser,
  getUsers,
  getStoreOwners,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes in this file are protected and for admins only
router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.route("/users").post(createUser).get(getUsers);

router.get("/store-owners", getStoreOwners);

module.exports = router;
