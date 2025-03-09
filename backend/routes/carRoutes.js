const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const { authMiddleware } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Authenticated User:", req.user);

        const { name, brand, type, year, rentPerDay, fuelType, seats, imageUrl, description, location, count } = req.body;

        if (!location || !location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).json({ message: "Invalid location. Provide [longitude, latitude]." });
        }

        const ownerId = req.user.id || req.user._id;
        console.log("Owner ID before conversion:", ownerId);

        const newCar = new Car({
            name,
            brand,
            type,
            year,
            rentPerDay,
            fuelType,
            seats,
            imageUrl,
            description,
            owner: new mongoose.Types.ObjectId(ownerId), // ✅ Convert to ObjectId
            location: {
                type: "Point",
                coordinates: [Number(location.coordinates[0]), Number(location.coordinates[1])]
            },
            count: count || 1 // ✅ Default to 1 if not provided
        });

        console.log("Before Saving:", newCar);
        await newCar.save();
        console.log("Car Saved Successfully!");

        res.status(201).json(newCar);
    } catch (error) {
        console.error("Error saving car:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const cars = await Car.find({});
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a single car (Public)
router.get("/:id", async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: "Car not found" });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update car details (Owner)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a car (Owner or Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
