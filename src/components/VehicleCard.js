import React from "react";
import "../styles/CarListing.css";
import { FaCar, FaGasPump, FaCogs, FaRoad, FaPaintBrush, FaUser } from "react-icons/fa";

const VehicleCard = ({ vehicle, detailed = false }) => {
  return (
    <div className={`vehicle-card ${detailed ? "detailed-vehicle-card" : ""}`}>
      <h2 className="vehicle-title">{vehicle.make} {vehicle.model}</h2>
      <p className="vehicle-price">Cost: ${vehicle.price}</p>
      <p className="vehicle-odometer">Odometer: {vehicle.mileage} miles</p>
      <p className="vehicle-seller">Sold by: John Adams</p>

      {/* Move the Contact Seller button here */}
      <button className="contact-button" onClick={() => window.location.href = "/contact-seller"}>
        Contact Seller
      </button>

      <div className="image-box">
        <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className="vehicle-image" />
      </div>

      {detailed && (
        <>
          <div className="vehicle-overview">
            <h2>Overview</h2>
            <p>
              The {vehicle.make} {vehicle.model} is a reliable, fuel-efficient sedan offering comfortable
              seating and advanced safety features, making it popular among families and commuters alike.
            </p>
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
        </>
      )}
    </div>
  );
};

export default VehicleCard;
