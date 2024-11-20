import React from "react";
import VehicleCard from "../components/VehicleCard"; // Use VehicleCard
import "../styles/CarListing.css";

const CarListingPage = () => {
  const exampleVehicle = {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 22000,
    mileage: 32000,
    location: "Los Angeles, CA",
    image: "images/camry1.jpg", // Adjust the path to your image
    dateAdded: "2024-10-15",
    drivetrain: "RWD",
  };

  return (
    <div className="car-listing-page">
      <VehicleCard vehicle={exampleVehicle} detailed={true} />
    </div>
  );
};

export default CarListingPage;
