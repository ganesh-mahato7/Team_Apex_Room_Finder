// Route/userRoute.js

const express = require("express");
const router  = express.Router();

const {
  register,
  activate,
  login,
  forgotPassword,
  resetPasswordController,
} = require("../controller/userController");

// Register (user or landlord)
router.post("/register", register);

// Activate account via email link
router.get("/activate/:token", activate);

// Login
router.post("/login", login);

// Forgot password — sends reset email
router.post("/forgot-password", forgotPassword);

// Reset password — updates password in DB
router.post("/reset-password/:token", resetPasswordController);

module.exports = router;