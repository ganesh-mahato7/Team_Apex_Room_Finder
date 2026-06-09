//scheduledVisitController

const db = require("../database/db.js");   // adjust path to your pg Pool instance

// ─────────────────────────────────────────────────────────────────────────────
// Helper: throw a formatted error
// ─────────────────────────────────────────────────────────────────────────────
function dbError(res, err) {
  console.error("DB error:", err);
  return res.status(500).json({ success: false, message: "Database error", error: err.message });
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/scheduled-visits
// Query param: ?status=pending|accepted|rejected|completed|cancelled
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllVisits = async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM scheduled_visits";
    const params = [];

    if (status) {
      query += " WHERE status = $1";
      params.push(status);
    }

    query += " ORDER BY visit_date ASC, visit_time ASC";

    const result = await db.query(query, params);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    return dbError(res, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/scheduled-visits/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.getVisitById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM scheduled_visits WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return dbError(res, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/scheduled-visits
// Body: { guest_name, property, visit_date, visit_time }
// ─────────────────────────────────────────────────────────────────────────────
exports.createVisit = async (req, res) => {
  try {
    const { guest_name, property, visit_date, visit_time } = req.body;

    if (!guest_name || !property || !visit_date || !visit_time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const result = await db.query(
      `INSERT INTO scheduled_visits (guest_name, property, visit_date, visit_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [guest_name, property, visit_date, visit_time]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return dbError(res, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/scheduled-visits/:id/status
// Body: { status: "accepted" | "rejected" | "completed" | "cancelled" }
// Allowed transitions:
//   pending   → accepted | rejected
//   accepted  → completed | cancelled
// ─────────────────────────────────────────────────────────────────────────────
exports.updateVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["accepted", "rejected", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowed.join(", ")}` });
    }

    // Fetch current status
    const current = await db.query("SELECT status FROM scheduled_visits WHERE id = $1", [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }

    const currentStatus = current.rows[0].status;

    // Validate transition
    const validTransitions = {
      pending:  ["accepted", "rejected"],
      accepted: ["completed", "cancelled"],
    };

    if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot move from "${currentStatus}" to "${status}"`,
      });
    }

    const result = await db.query(
      `UPDATE scheduled_visits
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return dbError(res, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/scheduled-visits/:id/reschedule
// Body: { visit_date, visit_time }
// Only allowed when status is "accepted"
// ─────────────────────────────────────────────────────────────────────────────
exports.rescheduleVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { visit_date, visit_time } = req.body;

    if (!visit_date || !visit_time) {
      return res.status(400).json({ success: false, message: "visit_date and visit_time are required" });
    }

    // Only accepted visits can be rescheduled
    const current = await db.query("SELECT status FROM scheduled_visits WHERE id = $1", [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }

    if (current.rows[0].status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted visits can be rescheduled",
      });
    }

    const result = await db.query(
      `UPDATE scheduled_visits
       SET visit_date = $1, visit_time = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [visit_date, visit_time, id]
    );

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return dbError(res, err);
  }
};