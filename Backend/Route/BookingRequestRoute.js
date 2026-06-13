const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// GET all pending booking requests
router.get("/booking-requests", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM booking_requests WHERE status = 'pending' ORDER BY request_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ACCEPT a booking request - moves it to confirmed_bookings
router.put("/booking-requests/:id/accept", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get the booking request
    const requestResult = await pool.query(
      "SELECT * FROM booking_requests WHERE id = $1",
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    const booking = requestResult.rows[0];

    // 2. Insert into confirmed_bookings
    const insertResult = await pool.query(
      `INSERT INTO confirmed_bookings 
        (tenant_name, property, request_date, message, token_amount, proposed_move_in, monthly_rent, status, confirmed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        booking.tenant_name,
        booking.property,
        booking.request_date,
        booking.message,
        booking.token_amount,
        booking.proposed_move_in,
        booking.monthly_rent,
        "Active",
      ]
    );

    // 3. Delete from booking_requests
    await pool.query("DELETE FROM booking_requests WHERE id = $1", [id]);

    res.json(insertResult.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REJECT a booking request
router.delete("/booking-requests/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM booking_requests WHERE id = $1", [id]);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// for the count of confirmed bookings
router.get("/confirmed-count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM confirmed_bookings"
    );

    res.json({
      count: Number(result.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;