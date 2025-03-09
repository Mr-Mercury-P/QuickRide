import React from "react";

const Home = () => {
  const pickupLines = [
    "Are you a luxury car? Because I’d love to take you for a ride!",
    "Is your name Tesla? Because you’ve got my heart running on autopilot!",
    "Are you a rental car? Because I’d love to take you home!",
    "Do you believe in love at first drive? Because I just found my dream ride!",
    "Are you a GPS? Because you always lead me in the right direction!",
  ];

  const homeStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#F3F4F6",
    textAlign: "center",
    padding: "2rem",
  };

  const headingStyles = {
    fontSize: "2.5rem",
    color: "#1E3A8A",
    fontWeight: "bold",
  };

  const textStyles = {
    fontSize: "1.2rem",
    color: "#4B5563",
    marginTop: "1rem",
    backgroundColor: "#FFFFFF",
    padding: "1rem 1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "90%",
    width: "100%",
  };

  return (
    <div style={homeStyles}>
      <h2 style={{ ...headingStyles, fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>Welcome to QuickRide!</h2>
      <p style={{ ...textStyles, fontSize: "clamp(1rem, 4vw, 1.2rem)" }}>{pickupLines[Math.floor(Math.random() * pickupLines.length)]}</p>
    </div>
  );
};

export default Home;