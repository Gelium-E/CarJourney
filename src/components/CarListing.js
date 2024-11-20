// src/components/CarListing.js
import React, { useState } from "react";
import VehicleCard from "./VehicleCard";
import "./CarListing.css";

const CarListing = () => {
  const [vehicles] = useState([
    {
      make: "Toyota",
      model: "Corolla",
      year: 2018,
      price: 15000,
      mileage: 35000,
      location: "Cypress, CA",
      image: "/images/corolla.jpg",
      dateAdded: "2024-09-12",
      drivetrain: "FWD",
    },
    // Add other vehicles here...
  ]);

  return (
    <main>
      <div id="vehicle-listings">
        {vehicles.map((vehicle, index) => (
          <VehicleCard key={index} vehicle={vehicle} />
        ))}
      </div>
    </main>
  );
};

export default CarListing;
