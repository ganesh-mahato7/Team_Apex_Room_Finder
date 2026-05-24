// model/userModel.js

const pool = require("../database/db");

// Create new user
const createUser = async (name, email, hashedPassword, role) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

// Find user by id
const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

// Activate user account
const activateUser = async (email) => {
  const result = await pool.query(
    "UPDATE users SET is_active = TRUE WHERE email = $1 RETURNING *",
    [email]
  );
  return result.rows[0];
};

// Save reset token and expiry
const setResetToken = async (email, token, expires) => {
  const result = await pool.query(
    "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING *",
    [token, expires, email]
  );
  return result.rows[0];
};

// Find user by reset token
const findUserByResetToken = async (token) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE reset_token = $1",
    [token]
  );
  return result.rows[0];
};

// Reset password and clear token
const resetPassword = async (email, hashedPassword) => {
  const result = await pool.query(
    "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2 RETURNING *",
    [hashedPassword, email]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  activateUser,
  setResetToken,
  findUserByResetToken,
  resetPassword,
};