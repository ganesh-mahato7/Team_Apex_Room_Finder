// model/roomModel.js

const pool = require("../database/db");

// Get all rooms with optional filters
const getRooms = async ({ search, type, minRent, maxRent, facilities, page, limit }) => {
  const offset = (page - 1) * limit;
  const values = [];
  let idx = 1;
  let where = ["r.is_approved = TRUE", "r.is_available = TRUE"];

  if (search) {
    where.push(`(r.location ILIKE $${idx} OR r.title ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }
  if (type && type !== "All") {
    where.push(`r.type = $${idx}`);
    values.push(type.toLowerCase());
    idx++;
  }
  if (minRent) {
    where.push(`r.rent >= $${idx}`);
    values.push(minRent);
    idx++;
  }
  if (maxRent) {
    where.push(`r.rent <= $${idx}`);
    values.push(maxRent);
    idx++;
  }
  if (facilities && facilities.length > 0) {
    where.push(`r.facilities @> $${idx}`);
    values.push(JSON.stringify(facilities));
    idx++;
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM rooms r ${whereClause}`,
    values
  );

  values.push(limit, offset);
  const result = await pool.query(
    `SELECT r.*, u.name AS landlord_name
     FROM rooms r
     LEFT JOIN users u ON r.user_id = u.id
     ${whereClause}
     ORDER BY r.created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  );

  return {
    rooms: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  };
};

// Get single room by id
const getRoomById = async (id) => {
  const result = await pool.query(
    `SELECT r.*, u.name AS landlord_name, u.email AS landlord_email
     FROM rooms r
     LEFT JOIN users u ON r.user_id = u.id
     WHERE r.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Create room (landlord)
const createRoom = async (data) => {
  const {
    userId, type, title, description, location,
    rent, mobile, email, facilities, images,
  } = data;
  const result = await pool.query(
    `INSERT INTO rooms
       (user_id, type, title, description, location, rent, mobile, email, facilities, images)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [userId, type, title, description, location, rent, mobile, email,
     JSON.stringify(facilities), JSON.stringify(images)]
  );
  return result.rows[0];
};

module.exports = { getRooms, getRoomById, createRoom };