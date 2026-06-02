// Backend/Route/userRoute.js

const express = require("express");
const router  = express.Router();

const {
  register,
  activate,
  login,
  forgotPassword,
  resetPasswordController,
  getProfile,
} = require("../controller/userController");

const { protect }      = require("../middleware/authMiddleware");
const { requireRole }  = require("../middleware/roleMiddleware");

// ── Public routes ──
router.post("/register",              register);
router.get("/activate/:token",        activate);
router.post("/login",                 login);
router.post("/forgot-password",       forgotPassword);
router.post("/reset-password/:token", resetPasswordController);

// ── Protected routes (any logged in user) ──
router.get("/profile", protect, getProfile);

// ── Admin only routes ──
router.get("/all-users", protect, requireRole("admin"), async (req, res) => {
  // TODO: get all users for admin dashboard
  res.json({ message: "Admin route — all users" });
});

module.exports = router;