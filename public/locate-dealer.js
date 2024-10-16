// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase Configuration
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
const db = getFirestore(app); // Initialize Firestore
console.log("Firebase initialized successfully.");

// Modal Handling (For header/login functionality)
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginClose = document.getElementById('login-close');
const registerClose = document.getElementById('register-close');
const forgotPasswordClose = document.getElementById('forgot-password-close');

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

  sendPasswordResetEmail(auth, email)
    .then(() => {
      showError(errorContainer, 'If an account exists, a reset email has been sent.');
    })
    .catch((error) => {
      console.error('Error during password reset:', error);
      showError(errorContainer, `Failed to send reset email: ${error.message}`);
    });
});

// Password validation with real-time feedback (For registration form)
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
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const errorContainer = document.getElementById('register-error');

  showError(errorContainer, "");

  if (!validatePassword(password)) {
    showError(errorContainer, "Invalid password. Ensure it meets the criteria.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: `${firstName} ${lastName}`
      }).then(() => {
        sendEmailVerification(user)
          .then(() => {
            showError(errorContainer, 'Verification email sent! Please check your inbox.');
          })
          .catch((error) => {
            showError(errorContainer, "Error sending verification email.");
          });
      }).catch((error) => {
        console.error("Error creating user in Firestore: ", error);
        showError(errorContainer, "Error saving user data.");
      });
    })
    .catch((error) => {
      showError(errorContainer, `Registration failed: ${error.message}`);
    });
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorContainer = document.getElementById('login-error');

  showError(errorContainer, ""); // Clear any previous errors

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

let uniqueDealerIds = new Set();  // Track unique dealer IDs to avoid duplicates
let userLocation = null;  // Store user's location globally

// Updated Locate a Dealer Functionality
document.getElementById('zipcode-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const zipcode = document.getElementById('zipcode-input').value;

  if (!zipcode) return;

  uniqueDealerIds.clear();  // Clear tracked dealer IDs to avoid duplicates

  // Convert Zipcode to geographic coordinates
  findDealersNearZipcode(zipcode);
});

function findDealersNearZipcode(zipcode) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': zipcode }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          userLocation = results[0].geometry.location;

          const service = new google.maps.places.PlacesService(document.createElement('div'));

          service.nearbySearch({
              location: userLocation,
              radius: 50000,  // Set a large radius (50km) to get more results
              type: ['car_dealer']
          }, handleResults);
      } else {
          console.log('Geocoding failed:', status);
      }
  });
}

function handleResults(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
      const newDealers = removeDuplicates(results);  // Remove duplicates
      displayDealerResults(newDealers);  // Display newly added dealers
  } else {
      console.log('No dealers found:', status);
  }
}

// Remove duplicate dealers by unique place_id
function removeDuplicates(dealers) {
  const uniqueDealers = [];

  dealers.forEach(dealer => {
      if (!uniqueDealerIds.has(dealer.place_id)) {  // Check by unique place_id
          uniqueDealerIds.add(dealer.place_id);     // Track the dealer by its place_id
          uniqueDealers.push(dealer);
      }
  });

  return uniqueDealers;
}

// Display dealer results, sorted by distance
function displayDealerResults(dealers) {
  const resultsContainer = document.getElementById('dealer-results');

  const distanceService = new google.maps.DistanceMatrixService();
  const dealerPromises = dealers.map(dealer => {
      return new Promise((resolve) => {
          distanceService.getDistanceMatrix({
              origins: [userLocation],
              destinations: [dealer.geometry.location],
              travelMode: 'DRIVING'
          }, function (response, status) {
              if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                  const distanceInMiles = response.rows[0].elements[0].distance.value * 0.000621371; // Convert meters to miles
                  dealer.distanceInMiles = distanceInMiles.toFixed(1);
                  resolve(dealer);
              } else {
                  resolve(null); // Handle errors gracefully
              }
          });
      });
  });

  Promise.all(dealerPromises).then((dealerResults) => {
      const validDealers = dealerResults.filter(dealer => dealer !== null);
      
      validDealers.sort((a, b) => parseFloat(a.distanceInMiles) - parseFloat(b.distanceInMiles));

      // Clear previous results before displaying new ones
      resultsContainer.innerHTML = ''; 

      validDealers.forEach(dealer => {
          const dealerDiv = document.createElement('div');
          dealerDiv.classList.add('dealer-item');

          // Use a placeholder image for dealers with no photo
          const photoUrl = dealer.photos ? dealer.photos[0].getUrl({ maxWidth: 200 }) : 'public/placeholder-locate-dealer.jpg';

          dealerDiv.innerHTML = `
              <div class="dealer-photo">
                  <img src="${photoUrl}" alt="${dealer.name}">
              </div>
              <div class="dealer-info">
                  <h3>${dealer.name}</h3>
                  <p>${dealer.vicinity}</p>
                  <p>${dealer.distanceInMiles} miles away</p>
              </div>
          `;
          resultsContainer.appendChild(dealerDiv);
      });
  });
}
