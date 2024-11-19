// src/pages/Favorite-Car.js
import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/Favorite-Car.css";

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage when the component mounts
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFromFavorites = (index) => {
    // Remove the selected car from favorites
    const updatedFavorites = [...favorites];
    updatedFavorites.splice(index, 1);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorite-list">

      {/* Navigation Headbar */}
      <div className="headerNav-container">
        <nav>
          <ul className="header-nav-list">
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
              favorites.map((car, index) => (
                <div key={index} className="car-item">
                  <div className="car-image">
                    <a href={`carListing.html?car=${car.name}`}>
                      <img src={car.image} alt={car.name} />
                    </a>
                    <i
                      className="fas fa-heart heart-icon"
                      onClick={() => removeFromFavorites(index)}
                    ></i>
                  </div>
                  <div className="car-details">
                    <div className="title-cost">
                      <h3>{car.name}</h3>
                      <p className="car-cost">{car.cost}</p>
                    </div>
                    <p className="odometer">{car.odometer}</p>
                    <p className="seller">{car.seller}</p>
                    <p className="contact-seller">
                      <a href="contact_seller.html" className="contact-seller-link">
                        Contact Seller <i className="fa-solid fa-arrow-up-right-from-square"></i>
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
