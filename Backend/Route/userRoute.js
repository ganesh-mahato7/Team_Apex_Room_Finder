const express = require("express");
const router  = express.Router();

const {
  register,
  activate,
  login,
} = require("../controller/userController");

// Register
router.post("/register", register);

// Activate account
router.get("/activate/:token", activate);

// Login
router.post("/login", login);

module.exports = router;