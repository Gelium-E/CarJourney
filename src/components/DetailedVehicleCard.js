import React from "react";
import "../styles/DetailedVehicleCard.css";
import { FaCar, FaGasPump, FaCogs, FaRoad, FaPaintBrush, FaUser } from "react-icons/fa";

const DetailedVehicleCard = ({ vehicle }) => {
  return (
    <div className="detailed-vehicle-card">
      <h1 className="vehicle-title">{vehicle.make} {vehicle.model} <span>&#10084;</span></h1>
      <p className="vehicle-price">Cost: ${vehicle.price}</p>
      <p className="vehicle-odometer">Odometer: {vehicle.mileage} miles</p>
      <p className="vehicle-seller">Sold by: John Adams</p>
      <button className="contact-button">Contact Seller</button>
      
      <div className="vehicle-image-container">
        <button className="image-nav prev">&#8249;</button>
        <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className="vehicle-image" />
        <button className="image-nav next">&#8250;</button>
      </div>
      
      <div className="vehicle-overview">
        <h2>Overview</h2>
        <p>This is a placeholder for the overview of the car. The {vehicle.make} {vehicle.model} is a reliable, fuel-efficient sedan that offers comfortable seating and advanced safety features, making it a popular choice for commuters and families alike.</p>
      </div>
      
      <div className="vehicle-highlights">
        <h2>Vehicle Highlights</h2>
        <div className="highlights-grid">
          <div><FaCar /> Body Style: SUV</div>
          <div><FaRoad /> MPG City/Hwy: 50</div>
          <div><FaCogs /> Drive Type: RWD</div>
          <div><FaGasPump /> Transmission: Automatic</div>
          <div><FaUser /> Interior Color: Black</div>
          <div><FaPaintBrush /> Exterior Color: White</div>
        </div>
      </div>
      
      <div className="vehicle-specs">
        <h2>Features and Specs</h2>
        <ul>
          <li>Engine: 2.5L 4-Cylinder</li>
          <li>Transmission: Automatic</li>
          <li>Fuel Economy: 28 MPG city / 39 MPG highway</li>
          <li>Seats: 5</li>
          <li>Bluetooth Connectivity</li>
          <li>Backup Camera</li>
          <li>Lane Departure Warning</li>
          <li>Adaptive Cruise Control</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailedVehicleCard;
