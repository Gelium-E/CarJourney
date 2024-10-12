import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyBpRdNjtxVGiC6NCjt58-gnJUdvnbODXpc",
    authDomain: "carjourney491b.firebaseapp.com",
    projectId: "carjourney491b",
    storageBucket: "carjourney491b.appspot.com",
    messagingSenderId: "248223244957",
    appId: "1:248223244957:web:4b1d289950719d829d6a74",
    measurementId: "G-WF2R4YV2CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// First JavaScript file wrapped in an IIFE
(function() {
  // Example code from the first JavaScript file
  const exampleVariable = "Hello, World!";

  function exampleFunction() {
    console.log("This is from the first script.");
  }

  document.getElementById("example-button").addEventListener("click", exampleFunction);
})();

// Second JavaScript file (your provided file) wrapped in another IIFE
(function() {
  // Sample vehicle data with price, year, mileage, and dateAdded fields
  const vehicles = [
    {
      make: "Toyota",
      model: "Corolla",
      year: 2018,
      price: 15000,
      mileage: 35000,
      location: "Cypress, CA",
      image: "images/corolla.jpg",
      dateAdded: "2024-09-12",
      drivetrain: "FWD"
    },
    {
      make: "Honda",
      model: "Civic",
      year: 2019,
      price: 17000,
      mileage: 30000,
      location: "Los Angeles, CA",
      image: "images/civic.jpg",
      dateAdded: "2024-09-10",
      drivetrain: "FWD"
    },
    {
      make: "Ford",
      model: "Fusion",
      year: 2017,
      price: 14000,
      mileage: 40000,
      location: "Irvine, CA",
      image: "images/fusion.jpg",
      dateAdded: "2024-09-08",
      drivetrain: "AWD"
    },
    {
      make: "Chevrolet",
      model: "Malibu",
      year: 2020,
      price: 20000,
      mileage: 25000,
      location: "Anaheim, CA",
      image: "images/malibu.jpg",
      dateAdded: "2024-09-05",
      drivetrain: "FWD"
    },
    {
      make: "Nissan",
      model: "Altima",
      year: 2021,
      price: 22000,
      mileage: 15000,
      location: "Santa Ana, CA",
      image: "images/altima.jpg",
      dateAdded: "2024-09-01",
      drivetrain: "AWD"
    },
    {
      make: "BMW",
      model: "3 Series",
      year: 2018,
      price: 27000,
      mileage: 45000,
      location: "Long Beach, CA",
      image: "images/bmw.jpg",
      dateAdded: "2024-08-28",
      drivetrain: "RWD"
    },
    {
      make: "Tesla",
      model: "Model 3",
      year: 2022,
      price: 45000,
      mileage: 5000,
      location: "Pasadena, CA",
      image: "images/tesla.jpg",
      dateAdded: "2024-08-20",
      drivetrain: "AWD"
    }
  ];

  // Function to display vehicle listings
  function displayListings(vehicleData) {
    const listingsContainer = document.getElementById("vehicle-listings");
    listingsContainer.innerHTML = ""; // Clear previous listings

    vehicleData.forEach(vehicle => {
      const card = document.createElement("div");
      card.classList.add("vehicle-card");
      card.innerHTML = `
        <div class="image-box">
          <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
        </div>
        <h2>${vehicle.make} ${vehicle.model}</h2>
        <p>Year: ${vehicle.year}</p>
        <p>Mileage: ${vehicle.mileage} miles</p>
        <p class="price">$${vehicle.price}</p>
        <p class="location">${vehicle.location}</p>
        <p>Date Listed: ${vehicle.dateAdded}</p>
        <p>Drivetrain: ${vehicle.drivetrain}</p>
      `;
      listingsContainer.appendChild(card);
    });
  }

  // Function to filter and sort vehicles based on criteria
  function filterAndSortVehicles() {
    const make = document.getElementById("make").value.toLowerCase();
    const model = document.getElementById("model").value.toLowerCase();
    const minPrice = parseFloat(document.getElementById("min-price").value);
    const maxPrice = parseFloat(document.getElementById("max-price").value);
    const year = parseInt(document.getElementById("year").value);
    const minMileage = parseFloat(document.getElementById("min-mileage").value);
    const maxMileage = parseFloat(document.getElementById("max-mileage").value);
    const drivetrain = document.getElementById("drivetrain").value;
    const sortOption = document.getElementById("sort-by").value;

    // Filter vehicles based on search criteria
    let filteredVehicles = vehicles.filter(vehicle => {
      const makeMatch = make === "" || vehicle.make.toLowerCase().includes(make);
      const modelMatch = model === "" || vehicle.model.toLowerCase().includes(model);
      const priceMatch = (isNaN(minPrice) || vehicle.price >= minPrice) &&
                         (isNaN(maxPrice) || vehicle.price <= maxPrice);
      const yearMatch = isNaN(year) || vehicle.year === year;
      const mileageMatch = (isNaN(minMileage) || vehicle.mileage >= minMileage) &&
                           (isNaN(maxMileage) || vehicle.mileage <= maxMileage);
      const drivetrainMatch = drivetrain === "" || vehicle.drivetrain === drivetrain;

      return makeMatch && modelMatch && priceMatch && yearMatch && mileageMatch && drivetrainMatch;
    });

    // Sort vehicles based on selected criteria
    if (sortOption === "price-asc") {
      filteredVehicles.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filteredVehicles.sort((a, b) => b.price - a.price);
    } else if (sortOption === "year-asc") {
      filteredVehicles.sort((a, b) => a.year - b.year);
    } else if (sortOption === "year-desc") {
      filteredVehicles.sort((a, b) => b.year - a.year);
    } else if (sortOption === "mileage-asc") {
      filteredVehicles.sort((a, b) => a.mileage - b.mileage);
    } else if (sortOption === "mileage-desc") {
      filteredVehicles.sort((a, b) => b.mileage - a.mileage);
    } else if (sortOption === "date-asc") {
      filteredVehicles.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)); // Oldest to Newest
    } else if (sortOption === "date-desc") {
      filteredVehicles.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // Newest to Oldest
    }

    displayListings(filteredVehicles); // Display the filtered and sorted listings
  }

  // Event listener for search form submission
  document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault();
    filterAndSortVehicles(); // Filter and sort vehicles on form submission
  });

  // Event listener for sorting dropdown
  document.getElementById("sort-by").addEventListener("change", function () {
    filterAndSortVehicles(); // Filter and sort vehicles when sorting option changes
  });

  // Initial display of vehicle listings (unsorted, all vehicles)
  displayListings(vehicles);

})();
