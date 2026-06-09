// routes/scheduledVisitsRoute.js
const express = require("express");
const router = express.Router();
const scheduledVisitsController = require("../controller/Scheduledvisitcontroller");

// GET all visits (optionally filter by status via ?status=pending etc.)
router.get("/", scheduledVisitsController.getAllVisits);

// GET a single visit by ID
router.get("/:id", scheduledVisitsController.getVisitById);

// POST create a new visit request
router.post("/", scheduledVisitsController.createVisit);

// PATCH update visit status (confirm → accepted, reject, complete, cancel)
router.patch("/:id/status", scheduledVisitsController.updateVisitStatus);

// PATCH reschedule a visit (update date/time)
router.patch("/:id/reschedule", scheduledVisitsController.rescheduleVisit);

module.exports = router;