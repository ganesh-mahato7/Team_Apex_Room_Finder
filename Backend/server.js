// Backend/server.js

const dotenv = require("dotenv");
dotenv.config();

const express    = require("express");
const cors       = require("cors");
const rateLimit  = require("express-rate-limit");
const pool       = require("./database/db");
const userRoute  = require("./Route/userRoute");

const app = express();

// ── Middleware ──
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ── Rate Limiters ──
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { message: "Too many login attempts. Please try again after 15 minutes." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      5,
  message:  { message: "Too many accounts created. Please try again after 1 hour." },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      3,
  message:  { message: "Too many requests. Please try again after 1 hour." },
});

// ── Apply Rate Limiters ──
app.use("/api/v1/users/login",           loginLimiter);
app.use("/api/v1/users/register",        registerLimiter);
app.use("/api/v1/users/forgot-password", forgotPasswordLimiter);

// ── DB Connection Test ──
pool.query("SELECT NOW()", (err) => {
  if (err) console.log("Database connection failed:", err.message);
  else     console.log("Database connected ✓");
});

// ── Test Route ──
app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

// ── API Routes ──
app.use("/api/v1/users", userRoute);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✓`);
});