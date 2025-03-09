require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminAuth = require("./routes/adminAuth");
const userCarBookings = require("./routes/userCarBookings");

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mycars", userCarBookings);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminAuth);
app.use("/", (req, res) => res.send("Home Route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
