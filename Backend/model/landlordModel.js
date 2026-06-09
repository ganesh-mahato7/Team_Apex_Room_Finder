const pool = require("../database/db");

// create user
const createUser = async (name, email, password) => {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const result = await pool.query(query, [name, email, password]);
    return result.rows[0];
};

// find user by email
const existingUser = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

module.exports = { createUser, existingUser };