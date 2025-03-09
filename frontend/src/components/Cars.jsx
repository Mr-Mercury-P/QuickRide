import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/cars");
        setCars(response.data);
        setAllCars(response.data);
      } catch (err) {
        setError("Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const applyFilters = () => {
    let filteredCars = allCars.filter(
      (car) =>
        (!brand || car.brand === brand) &&
        (!type || car.type === type) &&
        (!fuel || car.fuelType === fuel) &&
        (!maxPrice || car.rentPerDay <= maxPrice)
    );
    setCars(filteredCars);
  };

  if (loading) return <p>Loading cars...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Available Cars</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {[...new Set(allCars.map((car) => car.brand))].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Convertible">Convertible</option>
        </select>
        <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price per Day"
        />
        <button onClick={applyFilters} style={{ padding: "0.5rem 1rem", background: "#1E3A8A", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>Apply Filters</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
        {cars.map((car) => (
          <div key={car._id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "10px", backgroundColor: "#fff", textAlign: "center" }}>
            <img src={car.imageUrl} alt={car.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
            <h5>{car.name}</h5>
            <p><strong>Brand:</strong> {car.brand}</p>
            <p><strong>Type:</strong> {car.type}</p>
            <p><strong>Seats:</strong> {car.seats}</p>
            <p><strong>Fuel:</strong> {car.fuelType}</p>
            <p><strong>Rent/Day:</strong> ${car.rentPerDay}</p>
            <button onClick={() => navigate("/rent-a-car", { state: { car } })} style={{ padding: "0.5rem 1rem", background: "#FF5733", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cars;