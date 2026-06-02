const pool = require("../database/db");

// ── GET ALL USERS (admin) ──
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, email, role, is_active, is_blocked, created_at FROM users ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── DASHBOARD STATS (admin) ──
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers     = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'user'`);
    const totalLandlords = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'landlord'`);
    const totalTenants   = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'tenant'`);
    const totalListings  = await pool.query(`SELECT COUNT(*) FROM listings`);
    const totalRevenue   = await pool.query(`SELECT SUM(commission) FROM payments`);
    res.json({
      totalUsers:     parseInt(totalUsers.rows[0].count),
      totalLandlords: parseInt(totalLandlords.rows[0].count),
      totalTenants:   parseInt(totalTenants.rows[0].count),
      totalListings:  parseInt(totalListings.rows[0].count),
      totalRevenue:   totalRevenue.rows[0].sum || 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── SIDEBAR STATS (admin) ──
const getSidebarStats = async (req, res) => {
  try {
    const totalUsers       = await pool.query(`SELECT COUNT(*) FROM users WHERE is_blocked = false`);
    const totalListings    = await pool.query(`SELECT COUNT(*) FROM listings`);
    const reportedListings = await pool.query(`SELECT COUNT(*) FROM listings WHERE is_reported = true`);
    const outdatedListings = await pool.query(`SELECT COUNT(*) FROM listings WHERE updated_at < NOW() - INTERVAL '30 days'`);
    const pendingFeedback  = await pool.query(`SELECT COUNT(*) FROM feedback WHERE status = 'pending'`);
    const blockedUsers     = await pool.query(`SELECT COUNT(*) FROM users WHERE is_blocked = true`);
    res.json({
      totalUsers:       parseInt(totalUsers.rows[0].count),
      totalListings:    parseInt(totalListings.rows[0].count),
      reportedListings: parseInt(reportedListings.rows[0].count),
      outdatedListings: parseInt(outdatedListings.rows[0].count),
      pendingFeedback:  parseInt(pendingFeedback.rows[0].count),
      blockedUsers:     parseInt(blockedUsers.rows[0].count),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── ANALYTICS STATS (admin) ──
const getAnalyticsStats = async (req, res) => {
  try {
    const totalUsers     = await pool.query(`SELECT COUNT(*) FROM users`);
    const totalListings  = await pool.query(`SELECT COUNT(*) FROM listings`);
    const totalRevenue   = await pool.query(`SELECT COALESCE(SUM(commission), 0) FROM payments`);
    const totalLandlords = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'landlord'`);

    const usersByMonth = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);
    const listingsByMonth = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*) as count
      FROM listings
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);
    const revenueByMonth = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon') as month, COALESCE(SUM(commission), 0) as total
      FROM payments
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    res.json({
      totalUsers:      parseInt(totalUsers.rows[0].count),
      totalListings:   parseInt(totalListings.rows[0].count),
      totalRevenue:    parseFloat(totalRevenue.rows[0].coalesce),
      totalLandlords:  parseInt(totalLandlords.rows[0].count),
      usersByMonth:    usersByMonth.rows,
      listingsByMonth: listingsByMonth.rows,
      revenueByMonth:  revenueByMonth.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET ALL PAYMENTS (admin) ──
const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.amount, p.commission, p.platform_fee, p.status, p.created_at,
        t.name AS tenant_name,
        l.name AS landlord_name
      FROM payments p
      LEFT JOIN users t ON p.tenant_id   = t.id
      LEFT JOIN users l ON p.landlord_id = l.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── BLOCK USER (admin) ──
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE users SET is_blocked = true WHERE id = $1`, [id]);
    res.json({ message: "User blocked successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── UNBLOCK USER (admin) ──
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE users SET is_blocked = false WHERE id = $1`, [id]);
    res.json({ message: "User unblocked successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── UPDATE USER (admin) ──
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    await pool.query(`UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4`, [name, email, role, id]);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET ALL FEEDBACK (admin) ──
const getAllFeedback = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.id, f.title, f.message, f.type, f.status, f.created_at,
             u.name AS user_name, u.email AS user_email
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── RESOLVE FEEDBACK (admin) ──
const resolveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE feedback SET status = 'resolved' WHERE id = $1`, [id]);
    res.json({ message: "Feedback resolved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── REOPEN FEEDBACK (admin) ──
const reopenFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE feedback SET status = 'pending' WHERE id = $1`, [id]);
    res.json({ message: "Feedback reopened successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};