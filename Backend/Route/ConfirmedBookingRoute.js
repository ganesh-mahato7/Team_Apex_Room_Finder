const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// GET all confirmed bookings
router.get("/confirmed-bookings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM confirmed_bookings ORDER BY confirmed_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a confirmed booking
router.delete("/confirmed-bookings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM confirmed_bookings WHERE id = $1",
      [id]
    );

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET confirmed bookings count
router.get("/confirmed-count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM confirmed_bookings"
    );

    res.json({
      count: Number(result.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET pending booking requests count
router.get("/booking-requests-count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM booking_requests WHERE status = 'pending'"
    );

    res.json({
      count: Number(result.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;