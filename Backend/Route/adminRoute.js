const express = require("express");
const router  = express.Router();

const {
  getAllUsers,
  getDashboardStats,
  getSidebarStats,
  getAnalyticsStats,
  getAllPayments,
  blockUser,
  unblockUser,
  updateUser,
  getAllFeedback,
  resolveFeedback,
  reopenFeedback,
} = require("../controller/adminController");

// Users
router.get("/users/all",          getAllUsers);
router.put("/users/block/:id",    blockUser);
router.put("/users/unblock/:id",  unblockUser);
router.put("/users/:id",          updateUser);

// Stats
router.get("/stats",              getDashboardStats);
router.get("/sidebar-stats",      getSidebarStats);
router.get("/analytics",          getAnalyticsStats);

// Payments
router.get("/payments",           getAllPayments);

// Feedback
router.get("/feedback",           getAllFeedback);
router.put("/feedback/resolve/:id", resolveFeedback);
router.put("/feedback/reopen/:id",  reopenFeedback);

module.exports = router;