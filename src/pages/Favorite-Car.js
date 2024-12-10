// src/pages/Favorite-Car.js
import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/Favorite-Car.css";

/* FontAwesome Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';   // Solid heart
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons'; 

const FavoriteList = () => {
  // Initialize variables
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Remove the selected car from favorites
  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter((car) => car.id !== id);
    // updatedFavorites.splice(id, 1);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // HTML
  return (
    <div className="favorite-list">

      {/* Navigation Headbar */}
      <div className="headerNav-container">
        <nav>
          <ul className="header-nav-list">
            <li><a href="my-cars">My Cars</a></li>
            <li><a href="add-car">Add Cars</a></li>
            <li><a href="favorited-cars" className="active">Favorited Cars</a></li>
            <li><a href="saved-searches">Saved Searches</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main>
        <div className="container car-details">
          <h2>Favorited Cars</h2>
          <div id="favorite-cars-container" className="car-list">
            {favorites.length === 0 ? (
              <p>No favorited cars found.</p>
            ) : (
              favorites.map((car) => (
                <div key={car.id} className="car-item">
                  <div className="car-image">
                    <a href={`car-listing?make=${car.make}&model=${car.model}`}>
                      <img src={car.image} alt={car.make} />
                    </a>
                    <FontAwesomeIcon
                      icon={fasHeart}
                      className="heart-icon"
                      onClick={() => removeFromFavorites(car.id)}
                    />
                  </div>
                  <div className="car-details">
                    <div className="title-cost">
                      <h3>{car.make} {car.model}</h3>
                      <p className="car-cost">${Number(car.cost).toLocaleString()}</p>
                    </div>
                    <p className="odometer">{Number(car.odometer).toLocaleString()} miles</p> 
                    <p className="seller">{car.seller}</p>
                    <p className="contact-seller">
                      <a href="contact-seller" className="contact-seller-link">
                        Contact Seller <i><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></i>
                      </a>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default FavoriteList;