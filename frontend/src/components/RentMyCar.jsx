import axios from "axios";
import React, { useEffect, useState } from "react";

const CarDetails = () => {
  const [car, setCar] = useState({
    name: "", brand: "", type: "Sedan", year: "", rentPerDay: "", fuelType: "Petrol", seats: "", imageUrl: "", description: "", location: { coordinates: ["", ""] },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCar((prevCar) => ({
            ...prevCar,
            location: { ...prevCar.location, coordinates: [position.coords.longitude, position.coords.latitude] },
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
          if (error.code === 1) alert("Location access is denied. Please allow location in your browser settings.");
        }
      );
    }
  }, []);

  const handleChange = (e) => setCar((prevCar) => ({ ...prevCar, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized: Please log in first.");
    try {
      const response = await axios.post("http://localhost:4000/api/cars", car, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      alert("Car posted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error posting car:", error);
      alert("Failed to post car. Please try again.");
    }
  };

  const containerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: "5rem", // Ensures it stays below the navbar
    backgroundColor: "#F3F4F6",
  };

  const formStyles = {
    backgroundColor: "#FFFFFF",
    padding: "2rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const inputStyles = {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #D1D5DB",
    fontSize: "1rem",
    width: "100%",
  };

  const buttonStyles = {
    backgroundColor: "#1E3A8A",
    color: "white",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.3s ease",
    width: "100%",
  };

  return (
    <div style={containerStyles}>
      <form onSubmit={handleSubmit} style={formStyles}>
        <h4 style={{ textAlign: "center", color: "#1E3A8A" }}>Car Details</h4>
        {[{ name: "name", placeholder: "Car Name" }, { name: "brand", placeholder: "Brand" }, { name: "year", placeholder: "Year", type: "number" }, { name: "rentPerDay", placeholder: "Rent Per Day", type: "number" }, { name: "seats", placeholder: "Seats", type: "number" }, { name: "imageUrl", placeholder: "Image URL" }].map(({ name, placeholder, type = "text" }) => (
          <input key={name} type={type} name={name} placeholder={placeholder} value={car[name]} onChange={handleChange} required style={inputStyles} />
        ))}
        <select name="type" value={car.type} onChange={handleChange} style={inputStyles}>
          {["Sedan", "SUV", "Hatchback", "Convertible"].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select name="fuelType" value={car.fuelType} onChange={handleChange} style={inputStyles}>
          {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
            <option key={fuel} value={fuel}>{fuel}</option>
          ))}
        </select>
        <textarea name="description" placeholder="Description" value={car.description} onChange={handleChange} style={inputStyles}></textarea>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input type="number" placeholder="Longitude" value={car.location.coordinates[0]} readOnly style={inputStyles} />
          <input type="number" placeholder="Latitude" value={car.location.coordinates[1]} readOnly style={inputStyles} />
        </div>
        <button type="submit" style={buttonStyles}>Submit</button>
      </form>
    </div>
  );
};

export default CarDetails;