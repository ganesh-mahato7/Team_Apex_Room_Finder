// routes/userDashboardRoute.js
// All routes require auth + user/admin role

const express = require("express");
const router  = express.Router();

const { protect }                        = require("../middleware/authMiddleware");
const { requireRole }                    = require("../middleware/roleMiddleware");
const { getProfile, updateProfile }      = require("../controller/userProfileController");
const { getMyBookmarks, toggleBookmark } = require("../controller/bookmarkController");

// Apply protect + user role to all routes below
router.use(protect);
router.use(requireRole("user", "admin"));

// ── Profile ──
router.get("/profile",    getProfile);
router.put("/profile",    updateProfile);

// ── Bookmarks ──
router.get("/bookmarks",              getMyBookmarks);
router.post("/bookmarks/:roomId",     toggleBookmark);
router.delete("/bookmarks/:roomId",   toggleBookmark); // same handler, toggles

module.exports = router;