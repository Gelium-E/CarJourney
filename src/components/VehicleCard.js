// src/components/VehicleCard.js
import React from "react";
import "../styles/CarListing.css";

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="vehicle-card">
      <div className="image-box">
        <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} />
      </div>
      <h2>{vehicle.make} {vehicle.model}</h2>
      <p>Year: {vehicle.year}</p>
      <p>Mileage: {vehicle.mileage} miles</p>
      <p className="price">${vehicle.price}</p>
      <p className="location">{vehicle.location}</p>
      <p>Date Listed: {vehicle.dateAdded}</p>
      <p>Drivetrain: {vehicle.drivetrain}</p>
    </div>
  );
};

export default VehicleCard;
