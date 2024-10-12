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
const db = getFirestore(app);
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

      // Add the user to Firestore using the UID
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

/* Car Recommendation Quiz Logic */
let currentQuestion = 1;
const totalQuestions = 3;

// Disable the next button until an option is selected
document.querySelectorAll('.next-btn').forEach(button => {
  button.disabled = true;
});

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const questionId = this.closest('.quiz-question').id;
    document.querySelector(`#${questionId} .next-btn`).disabled = false;
  });
});

// Handle "Next" button clicks
document.querySelectorAll('.next-btn').forEach(button => {
  button.addEventListener('click', function() {
    const currentDiv = document.getElementById(`question-${currentQuestion}`);
    const nextDiv = document.getElementById(`question-${currentQuestion + 1}`);

    if (nextDiv) {
      currentDiv.style.display = 'none';
      nextDiv.style.display = 'block';
      updateProgress();
      currentQuestion++;
    } else {
      showResults();
    }
  });
});

function updateProgress() {
  const progressPercent = (currentQuestion / totalQuestions) * 100;
  document.querySelector('.progress').style.width = `${progressPercent}%`;
}

function showResults() {
  const quizResult = document.getElementById('quiz-result');
  quizResult.style.display = 'block';

  // Hide the form
  document.getElementById('car-quiz-form').style.display = 'none';

  // Retrieve user answers
  const use = document.querySelector('input[name="use"]:checked').value;
  const budget = document.querySelector('input[name="budget"]:checked').value;
  const priority = document.querySelector('input[name="priority"]:checked').value;

  const recommendation = getCarRecommendation(use, budget, priority);
  document.getElementById('car-recommendation').innerText = recommendation;
}

function getCarRecommendation(use, budget, priority) {
  const carDatabase = {
    commute: {
      "under-20000": "Honda Civic, Toyota Corolla, Hyundai Elantra",
      "20000-30000": "Mazda 3, Subaru Impreza, Volkswagen Jetta",
      "30000-50000": "Tesla Model 3, Audi A4, BMW 3 Series",
      "over-50000": "Mercedes-Benz E-Class, BMW 5 Series, Tesla Model S"
    },
    family: {
      "under-20000": "Honda Fit, Toyota Prius, Kia Soul",
      "20000-30000": "Toyota RAV4, Honda CR-V, Subaru Forester",
      "30000-50000": "Ford Explorer, Toyota Highlander, Kia Telluride",
      "over-50000": "BMW X5, Audi Q7, Volvo XC90"
    },
    adventure: {
      "under-20000": "Jeep Renegade, Subaru Crosstrek, Nissan Kicks",
      "20000-30000": "Toyota 4Runner, Jeep Cherokee, Ford Bronco Sport",
      "30000-50000": "Land Rover Discovery, Toyota Land Cruiser, Ford Bronco",
      "over-50000": "Mercedes G-Class, Land Rover Defender, Lexus LX"
    },
    luxury: {
      "under-20000": "Used BMW 3 Series, Lexus IS, Acura TLX",
      "20000-30000": "Audi A3, Volvo S60, Lexus ES",
      "30000-50000": "BMW 5 Series, Mercedes C-Class, Genesis G80",
      "over-50000": "Porsche Panamera, Tesla Model S, Mercedes S-Class"
    }
  };

  const budgetCars = carDatabase[use][budget];

  switch (priority) {
    case "fuel-economy":
      return `${budgetCars} - Known for Fuel Economy`;
    case "safety":
      return `${budgetCars} - Excellent Safety Ratings`;
    case "performance":
      return `${budgetCars} - Best for Performance Enthusiasts`;
    case "comfort":
      return `${budgetCars} - Known for Comfort and Features`;
    default:
      return `${budgetCars}`;
  }
}

document.getElementById('retake-quiz').addEventListener('click', function() {
  location.reload();
});

// Highlight the selected option
document.querySelectorAll('.quiz-options label').forEach(label => {
  label.addEventListener('click', function() {
    const siblings = this.parentNode.querySelectorAll('label');
    siblings.forEach(sib => sib.classList.remove('selected'));
    this.classList.add('selected');
  });
});
