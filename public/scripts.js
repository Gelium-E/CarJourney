// Import the Firebase modules needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

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

// Sample vehicle data
const vehicles = [
  { make: "Toyota", model: "Corolla", year: 2018, price: 15000, image: "car pics/2018-toyota-corolla.jpg" },
  { make: "Honda", model: "Civic", year: 2019, price: 17000, image: "car pics/2019-honda-civic.jpeg" },
  { make: "Ford", model: "Fusion", year: 2017, price: 14000, image: "car pics/2017-ford-fusion.jpg" }
];

// Display vehicle listings
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

    const img = document.createElement("img");
    img.src = vehicle.image || "https://via.placeholder.com/400x300?text=No+Image";
    img.alt = `${vehicle.make} ${vehicle.model}`;
    card.appendChild(img);

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

// Handle search form submission
document.getElementById("search-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const make = document.getElementById("make").value.trim().toLowerCase();
  const model = document.getElementById("model").value.trim().toLowerCase();
  const minPrice = parseFloat(document.getElementById("min-price").value);
  const maxPrice = parseFloat(document.getElementById("max-price").value);
  const year = parseInt(document.getElementById("year").value);

  if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
    alert("Minimum price cannot be greater than maximum price.");
    return;
  }

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

// Modal handling
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal'); // Added Forgot Password Modal
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginClose = document.getElementById('login-close');
const registerClose = document.getElementById('register-close');
const forgotPasswordClose = document.getElementById('forgot-password-close'); // Close for Forgot Password Modal

// Open login modal
loginBtn.addEventListener('click', function () {
  clearFormFields('login-form');
  loginModal.style.display = 'block';
});

// Open register modal
registerBtn.addEventListener('click', function () {
  clearFormFields('register-form');
  registerModal.style.display = 'block';
});

// Open Forgot Password modal
document.getElementById('forgot-password-link').addEventListener('click', function (event) {
  event.preventDefault();
  loginModal.style.display = 'none';
  clearFormFields('forgot-password-form');
  forgotPasswordModal.style.display = 'block';
});

// Close modals and clear input fields
loginClose.addEventListener('click', function () {
  clearFormFields('login-form');
  loginModal.style.display = 'none';
});

registerClose.addEventListener('click', function () {
  clearFormFields('register-form');
  registerModal.style.display = 'none';
});

forgotPasswordClose.addEventListener('click', function () {
  clearFormFields('forgot-password-form');
  forgotPasswordModal.style.display = 'none';
});

// Back to Login link functionality
document.getElementById('back-to-login-link').addEventListener('click', function (event) {
  event.preventDefault();
  forgotPasswordModal.style.display = 'none';
  clearFormFields('login-form');
  loginModal.style.display = 'block';
});

// Clear input fields when closing modals
function clearFormFields(formId) {
  const form = document.getElementById(formId);
  form.reset();
}

// Forgot Password form submission
document.getElementById('forgot-password-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('forgot-password-email').value;
  const errorContainer = document.getElementById('forgot-password-error');

  showError(errorContainer, ""); // Clear any previous errors

  // Use Firebase's sendPasswordResetEmail function to send the reset email
  sendPasswordResetEmail(auth, email)
    .then(() => {
      showError(errorContainer, 'If an account exists, a reset email has been sent.');
    })
    .catch((error) => {
      console.error('Error during password reset:', error);
      showError(errorContainer, `Failed to send reset email: ${error.message}`);
    });
});

// Password validation with real-time feedback
function validatePasswordRealTime(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  const lengthCriteria = document.getElementById('length-criteria');
  const numberCriteria = document.getElementById('number-criteria');
  const specialCharCriteria = document.getElementById('special-char-criteria');

  if (password.length >= minLength) {
    lengthCriteria.classList.add('valid');
    lengthCriteria.classList.remove('invalid');
  } else {
    lengthCriteria.classList.add('invalid');
    lengthCriteria.classList.remove('valid');
  }

  if (hasNumber.test(password)) {
    numberCriteria.classList.add('valid');
    numberCriteria.classList.remove('invalid');
  } else {
    numberCriteria.classList.add('invalid');
    numberCriteria.classList.remove('valid');
  }

  if (hasSpecialChar.test(password)) {
    specialCharCriteria.classList.add('valid');
    specialCharCriteria.classList.remove('invalid');
  } else {
    specialCharCriteria.classList.add('invalid');
    specialCharCriteria.classList.remove('valid');
  }
}

document.getElementById('register-password').addEventListener('input', function() {
  validatePasswordRealTime(this.value);
});

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(toggleIcon => {
  toggleIcon.addEventListener('click', function () {
    const targetInput = document.querySelector(this.getAttribute('data-toggle'));
    if (targetInput.type === 'password') {
      targetInput.type = 'text';
      this.classList.remove('fa-eye');
      this.classList.add('fa-eye-slash');
    } else {
      targetInput.type = 'password';
      this.classList.remove('fa-eye-slash');
      this.classList.add('fa-eye');
    }
  });
});

// Register form submission
document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const errorContainer = document.getElementById('register-error');

  showError(errorContainer, "");

  if (!validatePassword(password)) {
    showError(errorContainer, "Invalid password. Ensure it meets the criteria.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      sendEmailVerification(user)
        .then(() => {
          showError(errorContainer, 'Verification email sent! Please check your inbox.');
        })
        .catch((error) => {
          showError(errorContainer, "Error sending verification email.");
        });
    })
    .catch((error) => {
      showError(errorContainer, `Registration failed: ${error.message}`);
    });
});

// Handle login form submission with POST
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorContainer = document.getElementById('login-error');

  showError(errorContainer, ""); // Clear any previous errors

  // Use Firebase sign-in method to authenticate
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (user.emailVerified) {
        showError(errorContainer, 'Login successful!');
        loginModal.style.display = 'none'; // Close modal on success
      } else {
        showError(errorContainer, 'Please verify your email before logging in.');
        sendEmailVerification(user).then(() => {
          showError(errorContainer, 'Verification email sent again. Please check your inbox.');
        });
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
      showError(errorContainer, `Login failed: ${error.message}`);
    });
});

// Authentication state change handler
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const userIcon = document.getElementById('user-icon');

  if (user && user.emailVerified) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userIcon.style.display = 'block';
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    userIcon.style.display = 'none';
  }
});

// Sign-out functionality
document.getElementById('sign-out').addEventListener('click', function() {
  signOut(auth).then(() => {
    console.log("User signed out successfully.");
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
});

// Helper function to show error messages
function showError(container, message) {
  container.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Validate password structure
function validatePassword(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return password.length >= minLength && hasNumber.test(password) && hasSpecialChar.test(password);
}

// Toggle dropdown visibility when user icon is clicked
document.getElementById('user-icon-link').addEventListener('click', function(event) {
  event.preventDefault();

  const dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown if clicked outside
window.addEventListener('click', function(event) {
  const dropdownMenu = document.getElementById('dropdown-menu');
  const userIconLink = document.getElementById('user-icon-link');

  if (!userIconLink.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = 'none';
  }
});
