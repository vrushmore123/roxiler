const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updatePassword,
  registerAdmin,
  registerOwner,
  loginAdmin,
  loginOwner,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/register/owner", registerOwner);
router.post("/login", loginUser);
router.post("/login/admin", loginAdmin);
router.post("/login/owner", loginOwner);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
