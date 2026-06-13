// routes/roomRoute.js

const express = require("express");
const router  = express.Router();

const { listRooms, getRoom } = require("../controller/roomController");
const { protect }            = require("../middleware/authMiddleware");

// Public — list rooms with filters
router.get("/", listRooms);

// Public + optional auth (to check bookmark status)
router.get("/:id", (req, res, next) => {
  // Try to decode token if present, but don't block if absent
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const jwt     = require("jsonwebtoken");
      const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
      req.user      = decoded;
    } catch (_) {}
  }
  next();
}, getRoom);

module.exports = router;