// model/bookmarkModel.js

const pool = require("../database/db");

// Get all bookmarks for a user (with full room details)
const getUserBookmarks = async (userId) => {
  const result = await pool.query(
    `SELECT r.*, u.name AS landlord_name, b.created_at AS saved_at
     FROM bookmarks b
     JOIN rooms r ON b.room_id = r.id
     LEFT JOIN users u ON r.user_id = u.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Check if user has bookmarked a room
const isBookmarked = async (userId, roomId) => {
  const result = await pool.query(
    "SELECT id FROM bookmarks WHERE user_id = $1 AND room_id = $2",
    [userId, roomId]
  );
  return result.rows.length > 0;
};

// Add bookmark
const addBookmark = async (userId, roomId) => {
  const result = await pool.query(
    "INSERT INTO bookmarks (user_id, room_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
    [userId, roomId]
  );
  return result.rows[0];
};

// Remove bookmark
const removeBookmark = async (userId, roomId) => {
  const result = await pool.query(
    "DELETE FROM bookmarks WHERE user_id = $1 AND room_id = $2 RETURNING *",
    [userId, roomId]
  );
  return result.rows[0];
};

// Get bookmark count for a room
const getBookmarkCount = async (roomId) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM bookmarks WHERE room_id = $1",
    [roomId]
  );
  return parseInt(result.rows[0].count);
};

module.exports = {
  getUserBookmarks,
  isBookmarked,
  addBookmark,
  removeBookmark,
  getBookmarkCount,
};