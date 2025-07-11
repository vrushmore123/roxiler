const express = require("express");
const router = express.Router();
const {
  getStores,
  createStore,
  getOwnedStoreDetails,
  getStoresForUser,
} = require("../controllers/storeController");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   GET /api/stores
// @access  Public
router.get("/", getStores);

// @route   GET /api/stores/dashboard
// @access  Private
router.get("/dashboard", protect, getStoresForUser);

// @route   GET /api/stores/mystore
// @access  Private/Store Owner
router.get("/mystore", protect, authorize("Store Owner"), getOwnedStoreDetails);

// @route   POST /api/stores
// @access  Private/Admin
router.post("/", protect, authorize("admin"), createStore);

module.exports = router;
