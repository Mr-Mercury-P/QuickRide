import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const RentCar = () => {
  const location = useLocation();
  const car = location.state?.car;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const token = localStorage.getItem("token");

  if (!car) {
    return <h2>No car selected!</h2>;
  }

  const bookCar = async () => {
    if (!startDate || !endDate) {
      return setBookingMessage("Select both start and end dates.");
    }

    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      return setBookingMessage("Start date cannot be in the past.");
    }

    if (endDate < startDate) {
      return setBookingMessage("End date must be after the start date.");
    }

    if (!token) {
      return setBookingMessage("User not logged in. Please log in first.");
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ car: car._id, startDate, endDate }),
      });
      const result = await response.json();
      setBookingMessage(response.ok ? `Booking Pending for $${result.totalPrice} Waiting for approval` : result.message || "Booking failed.");
    } catch (error) {
      setBookingMessage("Error processing booking.");
    }
  };

  return (
    <div className="rent-car-container" style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>
      <div className="car-details" style={styles.carDetails}>
        <h5 style={styles.carName}>{car.brand} {car.name}</h5>
        <p><strong>Type:</strong> {car.type}</p>
        <p><strong>Seats:</strong> {car.seats}</p>
        <p><strong>Fuel:</strong> {car.fuelType}</p>
        <p><strong>Rent Per Day:</strong> ${car.rentPerDay}</p>
      </div>

      <div className="booking-details" style={styles.bookingDetails}>
        <h5 style={styles.bookingTitle}>Booking Details</h5>
        <div className="input-group" style={styles.inputGroup}>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="input-group" style={styles.inputGroup}>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={bookCar} className="confirm-btn" style={styles.button}>
          Confirm Booking
        </button>
      </div>

      {bookingMessage && <p style={styles.message}>{bookingMessage}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "1200px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333",
    fontSize: "24px",
  },
  carDetails: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  carName: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  bookingDetails: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  bookingTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    marginTop: "0.25rem",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#1E3A8A",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
    marginTop: "1rem",
  },
  message: {
    marginTop: "1rem",
    fontSize: "16px",
    color: "#d9534f",
    textAlign: "center",
  },
  // Mobile Styles
  "@media (max-width: 600px)": {
    container: {
      padding: "0.5rem",
      margin: "1rem",
    },
    heading: {
      fontSize: "20px",
    },
    carDetails: {
      padding: "0.75rem",
    },
    input: {
      padding: "0.75rem",
    },
    button: {
      padding: "0.5rem 1rem",
    },
  },
};

export default RentCar;
