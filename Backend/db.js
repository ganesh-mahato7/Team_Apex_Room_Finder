const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "roomfinder",
  password: "king@123",
  port: 5432,
});

module.exports = pool;