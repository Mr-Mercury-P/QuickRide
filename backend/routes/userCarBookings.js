const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all cars of logged-in user with bookings
router.get("/bookings", authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.id; // Get logged-in user ID from auth middleware
        console.log("Authenticated User:", req.user.id);

        // Find all cars owned by the logged-in user
        const cars = await Car.find({ owner: ownerId });

        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found for this user" });
        }

        // Extract car IDs
        const carIds = cars.map(car => car._id);
        console.log("Car IDs:", carIds);

        // Find bookings for these cars
        const bookings = await Booking.find({ car: { $in: carIds } });

        // Manually fetch user details for each booking
        const bookingsWithUser = await Promise.all(
            bookings.map(async (booking) => {
                const user = await User.findById(booking.user).select("username email mobile");
                return {
                    _id: booking._id,
                    car: booking.car,
                    user: user || null,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    totalPrice: booking.totalPrice,
                    status: booking.status
                };
            })
        );

        res.json({ cars, bookings: bookingsWithUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
