// Import the Firebase modules needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";

// Firebase configuration
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
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
console.log("Firebase initialized successfully.");

// Sample vehicle data (replace with real data from Firebase)
const vehicles = [
  {
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    price: 15000,
    image: "https://source.unsplash.com/400x300/?toyota,corolla"
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2019,
    price: 17000,
    image: "https://source.unsplash.com/400x300/?honda,civic"
  },
  {
    make: "Ford",
    model: "Fusion",
    year: 2017,
    price: 14000,
    image: "https://source.unsplash.com/400x300/?ford,fusion"
  }
];

// Function to display vehicle listings
function displayListings(vehicleData) {
  const listingsContainer = document.getElementById("listings-container");
  listingsContainer.innerHTML = "";

  if (vehicleData.length === 0) {
    listingsContainer.innerHTML = "<p>No vehicles found matching your criteria.</p>";
    return;
  }

  vehicleData.forEach(vehicle => {
    const card = document.createElement("div");
    card.classList.add("vehicle-card");

    // Vehicle Image
    const img = document.createElement("img");
    img.src = vehicle.image || "https://via.placeholder.com/400x300?text=No+Image";
    img.alt = `${vehicle.make} ${vehicle.model}`;
    card.appendChild(img);

    // Card Content
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const title = document.createElement("h3");
    title.textContent = `${vehicle.make} ${vehicle.model}`;
    cardContent.appendChild(title);

    const year = document.createElement("p");
    year.innerHTML = `<strong>Year:</strong> ${vehicle.year}`;
    cardContent.appendChild(year);

    const price = document.createElement("p");
    price.innerHTML = `<strong>Price:</strong> $${vehicle.price.toLocaleString()}`;
    cardContent.appendChild(price);

    card.appendChild(cardContent);
    listingsContainer.appendChild(card);
  });
}

// Function to handle search form submission
document.getElementById("search-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const make = document.getElementById("make").value.trim().toLowerCase();
  const model = document.getElementById("model").value.trim().toLowerCase();
  const minPrice = parseFloat(document.getElementById("min-price").value);
  const maxPrice = parseFloat(document.getElementById("max-price").value);
  const year = parseInt(document.getElementById("year").value);

  // Validate input data
  if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
    alert("Minimum price cannot be greater than maximum price.");
    return;
  }

  // Filter vehicles based on search criteria
  const filteredVehicles = vehicles.filter(vehicle => {
    const makeMatch = !make || vehicle.make.toLowerCase().includes(make);
    const modelMatch = !model || vehicle.model.toLowerCase().includes(model);
    const priceMatch = (isNaN(minPrice) || vehicle.price >= minPrice) &&
                       (isNaN(maxPrice) || vehicle.price <= maxPrice);
    const yearMatch = isNaN(year) || vehicle.year === year;

    return makeMatch && modelMatch && priceMatch && yearMatch;
  });

  displayListings(filteredVehicles);
});

// Initial display of vehicle listings
displayListings(vehicles);

// Modal Functionality
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginClose = document.getElementById('login-close');
const registerClose = document.getElementById('register-close');

// Open login modal
loginBtn.addEventListener('click', function () {
  loginModal.style.display = 'block';
});

// Open register modal
registerBtn.addEventListener('click', function () {
  registerModal.style.display = 'block';
});

// Close login modal
loginClose.addEventListener('click', function () {
  loginModal.style.display = 'none';
});

// Close register modal
registerClose.addEventListener('click', function () {
  registerModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function (event) {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  } else if (event.target === registerModal) {
    registerModal.style.display = 'none';
  }
});

// Helper function to show error messages
function showError(container, message) {
  container.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Password validation function with real-time feedback
function validatePasswordRealTime(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  const lengthCriteria = document.getElementById('length-criteria');
  const numberCriteria = document.getElementById('number-criteria');
  const specialCharCriteria = document.getElementById('special-char-criteria');

  // Check length
  if (password.length >= minLength) {
    lengthCriteria.classList.remove('invalid');
    lengthCriteria.classList.add('valid');
  } else {
    lengthCriteria.classList.remove('valid');
    lengthCriteria.classList.add('invalid');
  }

  // Check for number
  if (hasNumber.test(password)) {
    numberCriteria.classList.remove('invalid');
    numberCriteria.classList.add('valid');
  } else {
    numberCriteria.classList.remove('valid');
    numberCriteria.classList.add('invalid');
  }

  // Check for special character
  if (hasSpecialChar.test(password)) {
    specialCharCriteria.classList.remove('invalid');
    specialCharCriteria.classList.add('valid');
  } else {
    specialCharCriteria.classList.remove('valid');
    specialCharCriteria.classList.add('invalid');
  }
}

// Dynamically update password requirements as the user types
document.getElementById('register-password').addEventListener('input', function() {
  validatePasswordRealTime(this.value);
});

// Register Form Submission
document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting the default way

  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const errorContainer = document.getElementById('register-error'); // Error message container

  // Clear previous error messages
  showError(errorContainer, "");

  // Validate password
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  let errorMessage = "";
  if (password.length < minLength) {
    errorMessage += "Password must be at least 8 characters long. ";
  }
  if (!hasNumber.test(password)) {
    errorMessage += "Password must contain at least one numeric value. ";
  }
  if (!hasSpecialChar.test(password)) {
    errorMessage += "Password must contain at least one special character. ";
  }

  if (errorMessage) {
    showError(errorContainer, errorMessage);
    return;
  }

  console.log(`Attempting to register user with email: ${email}`);

  // Firebase sign-up
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      console.log('User registered successfully:', user);

      // Send email verification after registration
      sendEmailVerification(user).then(() => {
        showError(errorContainer, 'Verification email sent! Please check your inbox.');
      }).catch(error => {
        showError(errorContainer, "Error sending verification email.");
        console.error("Error sending verification email:", error);
      });

      // Optionally: Hide modal after registration
      // document.getElementById('register-modal').style.display = 'none';
    })
    .catch((error) => {
      console.error('Error during registration:', error);
      showError(errorContainer, `Registration failed: ${error.message}`);
    });
});

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from submitting the default way

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorContainer = document.getElementById('login-error'); // Error message container

  // Clear previous error messages
  showError(errorContainer, "");

  console.log(`Attempting to log in with email: ${email}`);

  // Firebase sign-in
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      console.log('User signed in successfully:', user);

      // Check if the user is verified
      if (user.emailVerified) {
        showError(errorContainer, 'Login successful!');
        document.getElementById('login-modal').style.display = 'none'; // Close modal
      } else {
        showError(errorContainer, 'Please verify your email before logging in.');
        console.log("Login attempted, but email is not verified for user:", user);
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
      showError(errorContainer, `Login failed: ${error.message}`);
    });
});

