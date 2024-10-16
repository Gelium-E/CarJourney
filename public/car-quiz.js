// Import the Firebase modules needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

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
const db = getFirestore(app);  // Initialize Firestore
console.log("Firebase initialized successfully.");

// Modal handling (For future use with header/login functionality)
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

  showError(errorContainer, "");

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

// Handle login form submission with POST
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorContainer = document.getElementById('login-error');

  showError(errorContainer, "");

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (user.emailVerified) {
        showError(errorContainer, 'Login successful!');
        loginModal.style.display = 'none';
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

// Car Quiz Implementation - Step by Step Navigation
document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  const totalSteps = document.querySelectorAll('.quiz-step').length;

  document.getElementById('next-button').addEventListener('click', function() {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      showStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      document.getElementById('car-quiz-form').dispatchEvent(new Event('submit'));
    }
  });

  document.getElementById('car-quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const location = document.querySelector('input[name="driving-location"]:checked')?.value;
    const offRoading = document.querySelector('input[name="off-roading"]:checked')?.value;
    const cargoSpace = document.querySelector('input[name="cargo-space"]:checked')?.value;
    const carUse = document.querySelector('input[name="car-use"]:checked')?.value;
    const mustHave = document.querySelector('input[name="must-have"]:checked')?.value;
    const higherUp = document.querySelector('input[name="higher-up"]:checked')?.value;
    const towing = document.querySelector('input[name="towing"]:checked')?.value;
    const seatingRows = document.querySelector('input[name="seating-rows"]:checked')?.value;

    if (!location || !offRoading || !cargoSpace || !carUse || !mustHave || !higherUp || !towing || !seatingRows) {
      alert('Please complete all questions before submitting.');
      return;
    }

    let recommendation = '';
    let recommendationDescription = '';

    if (location === 'off-road' || offRoading === 'yes' || mustHave === 'off-road' || towing === 'yes') {
      recommendation = 'Truck';
      recommendationDescription = 'Trucks are ideal for off-roading and towing heavy loads.';
    } else if (cargoSpace === 'family' || carUse === 'kids' || seatingRows === '3') {
      recommendation = 'Minivan';
      recommendationDescription = 'Minivans provide ample space for families and multiple rows of seating.';
    } else if (location === 'suburbs' || higherUp === 'yes' || cargoSpace === 'extra' || towing === 'maybe') {
      recommendation = 'SUV';
      recommendationDescription = 'SUVs offer a balance of cargo space, higher driving position, and sometimes off-road capabilities.';
    } else if (carUse === 'performance' || seatingRows === '1') {
      recommendation = 'Coupe';
      recommendationDescription = 'Coupes are sporty vehicles designed for high performance.';
    } else {
      recommendation = 'Sedan';
      recommendationDescription = 'Sedans offer a great balance of performance, comfort, and efficiency.';
    }

    const resultDiv = document.getElementById('quiz-result');
    resultDiv.innerHTML = `<h3>We recommend you get a ${recommendation}!</h3><p>${recommendationDescription}</p>`;
    resultDiv.style.display = 'block';

    document.querySelector('.quiz-navigation').style.display = 'none';
  });

  function showStep(step) {
    const currentStepElement = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
    if (currentStepElement) {
      currentStepElement.style.display = 'none';
    }

    if (step > totalSteps || step < 1) {
      console.error(`Element for step ${step} not found.`);
      return;
    }

    const newStepElement = document.querySelector(`.quiz-step[data-step="${step}"]`);
    if (newStepElement) {
      newStepElement.style.display = 'block';
      currentStep = step;
    }
  }

  function validateStep(step) {
    const inputs = document.querySelectorAll(`.quiz-step[data-step="${step}"] input[type="radio"]`);
    for (const input of inputs) {
      if (input.checked) return true;
    }
    alert('Please answer the question before proceeding.');
    return false;
  }
});