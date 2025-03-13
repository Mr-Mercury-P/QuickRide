const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { car, startDate, endDate } = req.body; 
        const user = req.user.id; 
        console.log("hi", car, startDate, endDate, user)

        if (!car || !startDate || !endDate) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const selectedCar = await Car.findById(car);
        if (!selectedCar) return res.status(404).json({ message: "Car not found" });

        // 🔍 Check if the car is available for the given dates
        const existingBookings = await Booking.find({
            car,
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } } // Overlapping dates
            ]
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: "Car is already booked for the selected dates." });
        }

        const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
        const totalPrice = days * selectedCar.rentPerDay;

        // 📝 Create booking
        const newBooking = new Booking({ car, user, startDate, endDate, totalPrice, status: "Confirmed" });
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});


// ✅ Get all bookings (for admin or users)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate("car user", "name brand type rentPerDay");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a specific booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("car user");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Cancel a booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = "Cancelled";
        await booking.save();

        res.json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Approve a booking
router.patch('/:id/approve', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (booking.status === "Cancelled") {
            return res.status(400).json({ message: "Cancelled booking cannot be approved" });
        }

        booking.status = "Confirmed";
        await booking.save();
        res.json({ message: "Booking approved successfully", booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Reject a booking
router.patch('/:id/reject', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (booking.status === "Confirmed") {
            return res.status(400).json({ message: "Approved booking cannot be rejected" });
        }

        booking.status = "Cancelled";
        await booking.save();
        console.log("booking rejected");
        res.json({ message: "Booking rejected successfully", booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
