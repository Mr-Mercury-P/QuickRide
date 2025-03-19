import React, { useEffect, useState } from "react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/mycars/bookings", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setCars(data.cars);
          setBookings(data.bookings);
        } else {
          setError(data.message || "Failed to fetch bookings");
        }
      } catch (error) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const handleApprove = async (bookingId) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking._id === bookingId && booking.status === "Pending") {
        return { ...booking, status: "Confirmed" };
      }
      return booking;
    });
  
    setBookings(updatedBookings);
  
    await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    // Re-fetch the latest bookings from the database to sync with the backend
    fetchBookings();
  };
  
  const handleReject = async (bookingId) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking._id === bookingId && booking.status === "Pending") {
        return { ...booking, status: "Cancelled" };
      }
      return booking;
    });
  
    setBookings(updatedBookings);
  
    await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    // Re-fetch the latest bookings from the database to sync with the backend
    fetchBookings();
  };
  
  const handleDeleteCar = async (carId) => {
    await fetch(`http://localhost:5000/api/cars/${carId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCars(cars.filter(car => car._id !== carId));
  };

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#F3F4F6",
    padding: "2rem",
  };

  const cardStyles = {
    backgroundColor: "#FFFFFF",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "1rem",
    textAlign: "left"
  };

  const headingStyles = {
    textAlign: "center",
    color: "#1E3A8A",
    marginBottom: "1.5rem",
    fontSize: "1.75rem",
    fontWeight: "bold"
  };

  const listItemStyles = {
    backgroundColor: "#EFF6FF",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    marginBottom: "0.5rem",
  };

  const buttonStyles = {
    margin: "0.5rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "0.5rem",
    backgroundColor: "#1E3A8A",
    color: "#FFFFFF",
  };

  return (
    <div style={containerStyles}>
      <h2 style={headingStyles}>My Car Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cars.length === 0 ? (
        <p>You haven't listed any cars.</p>
      ) : (
        cars.map(car => (
          <div key={car._id} style={cardStyles}>
            <h3 style={{ color: "#1E3A8A", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{car.brand} - {car.name}</h3>
            <button style={buttonStyles} onClick={() => handleDeleteCar(car._id)}>Delete Car</button>
            <p style={{ fontWeight: "bold" }}>Bookings:</p>
            <ul style={{ paddingLeft: "1rem" }}>
              {bookings.filter(booking => booking.car === car._id).length === 0 ? (
                <p>No bookings yet.</p>
              ) : (
                bookings
                  .filter(booking => booking.car === car._id)
                  .map(booking => (
                    <li key={booking._id} style={listItemStyles}>
                      <p><strong>{booking.user?.username || "Unknown User"}</strong></p>
                      <p>Email: {booking.user?.email || "No Email"}</p>
                      <p>Mobile: {booking.user?.mobile || "No Mobile"}</p>
                      <p>From: {new Date(booking.startDate).toLocaleDateString()} To: {new Date(booking.endDate).toLocaleDateString()}</p>
                      <p>Status: {booking.status}</p>
                      <button style={buttonStyles} onClick={() => handleApprove(booking._id)}>Approve</button>
                      <button style={buttonStyles} onClick={() => handleReject(booking._id)}>Reject</button>
                    </li>
                  ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Bookings;