// model/userProfileModel.js
// Profile-specific queries (add these to userModel or import separately)

const pool = require("../database/db");

// Get user profile (safe fields only)
const getUserProfile = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, role, phone, avatar_url, bio, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update user profile
const updateUserProfile = async (id, { name, phone, bio }) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1, phone = $2, bio = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, role, phone, avatar_url, bio, created_at`,
    [name, phone || null, bio || null, id]
  );
  return result.rows[0];
};

// Update avatar
const updateAvatar = async (id, avatarUrl) => {
  const result = await pool.query(
    "UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [avatarUrl, id]
  );
  return result.rows[0];
};

// Get user activity summary (bookmark count, etc.)
const getUserStats = async (id) => {
  const bookmarks = await pool.query(
    "SELECT COUNT(*) FROM bookmarks WHERE user_id = $1",
    [id]
  );
  return {
    savedRooms: parseInt(bookmarks.rows[0].count),
  };
};

module.exports = { getUserProfile, updateUserProfile, updateAvatar, getUserStats };