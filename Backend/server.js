const dotenv    = require("dotenv");
dotenv.config();

const express   = require("express");
const cors      = require("cors");
const pool      = require("./database/db");
const userRoute = require("./Route/userRoute");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test DB connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("Database connected");
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

// User routes
app.use("/api/v1/users", userRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});