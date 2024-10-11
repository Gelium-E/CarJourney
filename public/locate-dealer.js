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
const forgotPasswordModal = document.getElementById('forgot-password-modal'); // Forgot Password Modal
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

// Handle dealer count selection
document.getElementById('dealer-count-select').addEventListener('change', function() {
    const dealerCount = this.value;
    // Call the function to limit the displayed dealers
    limitDealerResults(dealerCount);
});

// Locate a Dealer Functionality
document.getElementById('zipcode-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const zipcode = document.getElementById('zipcode-input').value;
    const radius = document.getElementById('radius-select').value;

    if (!zipcode) return;

    // Convert Zipcode to geographic coordinates
    findDealersNearZipcode(zipcode, radius);
});

function findDealersNearZipcode(zipcode, radius) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': zipcode }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;

            // Use Google Places API to search for car dealers within the selected radius
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            service.nearbySearch({
                location: location,
                radius: parseInt(radius),  // Search within the user-selected radius
                type: ['car_dealer']
            }, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const uniqueDealers = removeDuplicates(results); // Remove duplicates
                    displayDealerResults(uniqueDealers, location);
                } else {
                    console.log('No dealers found:', status);
                }
            });
        } else {
            console.log('Geocoding failed:', status);
        }
    });
}

// Remove duplicate dealers by name
function removeDuplicates(dealers) {
    const uniqueDealers = [];
    const dealerNames = new Set();

    dealers.forEach(dealer => {
        if (!dealerNames.has(dealer.name)) {
            dealerNames.add(dealer.name);
            uniqueDealers.push(dealer);
        }
    });

    return uniqueDealers;
}

// Display dealer results, sorted by distance
function displayDealerResults(dealers, userLocation) {
    const resultsContainer = document.getElementById('dealer-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Use Distance Matrix to calculate distance and sort by distance
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
        // Filter out any null results
        const validDealers = dealerResults.filter(dealer => dealer !== null);
        
        // Sort by distance
        validDealers.sort((a, b) => parseFloat(a.distanceInMiles) - parseFloat(b.distanceInMiles));

        // Display sorted results
        validDealers.forEach(dealer => {
            const dealerDiv = document.createElement('div');
            dealerDiv.classList.add('dealer-item');

            const photoUrl = dealer.photos ? dealer.photos[0].getUrl({ maxWidth: 200 }) : 'placeholder.jpg';

            dealerDiv.innerHTML = `
                <div class="dealer-photo">
                    <img src="${photoUrl}" alt="${dealer.name}">
                </div>
                <div class="dealer-info">
                    <h3>${dealer.name}</h3>
                    <p>${dealer.vicinity}</p>
                    <p>${dealer.distanceInMiles} miles away</p>
                    <div>
                        <button class="visit-site-btn">Visit Site</button>
                        <button class="view-cars-btn">View Cars</button>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(dealerDiv);
        });
    });
}

// Limit the number of displayed dealers
function limitDealerResults(limit) {
    const allDealers = document.querySelectorAll('.dealer-item');
    allDealers.forEach((dealer, index) => {
        dealer.style.display = (index < limit) ? 'flex' : 'none';
    });
}
