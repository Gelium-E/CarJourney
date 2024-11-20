import React from "react";
import DetailedVehicleCard from "../components/DetailedVehicleCard";
import "../styles/CarListing.css";

import camry1 from "../assets/camry1.jpg"; // Import the image

const CarListingPage = () => {
  const exampleVehicle = {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 22000,
    mileage: 32000,
    location: "Los Angeles, CA",
    image: camry1, // Use the imported image
    dateAdded: "2024-10-15",
    drivetrain: "RWD",
  };

  return (
    <div className="car-listing-page">
      <DetailedVehicleCard vehicle={exampleVehicle} />
    </div>
  );
};

export default CarListingPage;
