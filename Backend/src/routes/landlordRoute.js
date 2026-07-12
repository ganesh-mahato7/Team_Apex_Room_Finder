// Backend/Route/landlordRoute.js

const express = require("express");
const router  = express.Router();

const { protect }     = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const {
  getLandlordProfile,
  updateLandlordProfile,
  getMyListings,
  addProperty,
  deleteListing,
  toggleAvailability,
} = require("../controller/LandlordController");

// All landlord routes require auth + landlord role
router.use(protect);
router.use(requireRole("landlord", "admin"));

// ── Profile ──
router.get("/profile",    getLandlordProfile);
router.put("/profile",    updateLandlordProfile);

// ── Listings ──
router.get("/listings",              getMyListings);
router.post("/listings",             addProperty);
router.delete("/listings/:id",       deleteListing);
router.patch("/listings/:id/toggle", toggleAvailability);

module.exports = router;
