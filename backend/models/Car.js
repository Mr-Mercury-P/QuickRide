const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    type: { type: String, enum: ["Sedan", "SUV", "Hatchback", "Convertible"], required: true },
    year: { type: Number, required: true },
    rentPerDay: { type: Number, required: true },
    fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], required: true },
    seats: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 📍 Location (Added)
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    }
}, { timestamps: true });

carSchema.index({ location: "2dsphere" }); // 🌍 Enable geospatial queries

module.exports = mongoose.model("Car", carSchema);
