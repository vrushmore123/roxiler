const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updatePassword,
  registerAdmin,
  registerOwner,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/register/owner", registerOwner);
router.post("/login", loginUser);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
