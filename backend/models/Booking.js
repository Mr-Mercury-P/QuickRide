const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Confirmed", "Cancelled"], default: "Confirmed" }
});

module.exports = mongoose.model("Booking", bookingSchema);
