<<<<<<< HEAD
const dotenv     = require("dotenv");
=======
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const userRoute = require("./route/userRoute");
const bookingRoute = require("./Route/BookingRequestRoute");
const bookingRequestRoutes = require("./Route/BookingRequestRoute");
const confirmedBookingRoutes = require("./Route/ConfirmedBookingRoute");
const scheduledVisitsRoute = require("./Route/Scheduledvisitsroute");


>>>>>>> kumar
dotenv.config();

const express    = require("express");
const cors       = require("cors");
const pool       = require("./database/db");
const userRoute  = require("./Route/userRoute");
const adminRoute = require("./Route/adminRoute");

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

<<<<<<< HEAD
// Test route
app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

// Routes
app.use("/api/v1/users",  userRoute);
app.use("/api/v1/admin",  adminRoute);
=======
// API routes
app.use("/api/v1/users", userRoute);
app.use("/api", bookingRoute);
app.use("/api", bookingRequestRoutes);
app.use("/api", confirmedBookingRoutes);
app.use("/api/scheduled-visits", scheduledVisitsRoute);
>>>>>>> kumar

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