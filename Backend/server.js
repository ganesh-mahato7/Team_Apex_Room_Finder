const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const userRoute = require("./route/userRoute");
const bookingRoute = require("./Route/BookingRequestRoute");
const bookingRequestRoutes = require("./Route/BookingRequestRoute");
const confirmedBookingRoutes = require("./Route/ConfirmedBookingRoute");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

// API routes
app.use("/api/v1/users", userRoute);
app.use("/api", bookingRoute);
app.use("/api", bookingRequestRoutes);
app.use("/api", confirmedBookingRoutes);


// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});