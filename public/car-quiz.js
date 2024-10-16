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

// Car questionnaire functionality with images
document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("question-container");
  const resultContainer = document.getElementById("result-container");

  // Questions and answers for the car questionnaire with images
  const questions = [
    {
      question: "What type of car are you interested in?",
      answers: [
        { text: "Sedan", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/sedan-quiz_akwltu.svg" }, 
        { text: "SUV", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/suv-quiz_ymxmu9.svg" }, 
        { text: "Truck", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/truck-quiz_cltsmr.svg" }, 
        { text: "Coupe", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/coupe-quiz_vp6gby.svg" }, 
        { text: "Convertible", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/convertible-quiz_xuiaui.svg" },
        { text: "Van", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108745/van-quiz_zmkhzf.svg" }
      ]
    },
    {
      question: "What will you use the car for most?",
      answers: [
        { text: "Daily commute" }, 
        { text: "Long-distance travel" }, 
        { text: "Off-road" }, 
        { text: "City driving" }, 
        { text: "Family trips" }
      ]
    },
    {
      question: "How important is fuel efficiency?",
      answers: [
        { text: "Very important" }, 
        { text: "Moderately important" }, 
        { text: "Not important" }
      ]
    },
    {
      question: "What kind of performance are you looking for?",
      answers: [
        { text: "Comfort-oriented" }, 
        { text: "Sporty" }, 
        { text: "Balanced" }, 
        { text: "High performance" }
      ]
    },
    {
      question: "Do you have a preference for technology features?",
      answers: [
        { text: "Advanced safety features" }, 
        { text: "Luxury and infotainment" }, 
        { text: "Basic features are fine" }
      ]
    }
  ];

  const carRecommendations = {
    "Sedan,Daily commute,Very important,Comfort-oriented,Advanced safety features": "Toyota Corolla Hybrid",
    "SUV,Family trips,Moderately important,Comfort-oriented,Luxury and infotainment": "Honda CR-V",
    "Truck,Off-road,Not important,High performance,Basic features are fine": "Ford F-150 Raptor",
    "Coupe,Sporty,Not important,High performance,Luxury and infotainment": "Chevrolet Corvette",
    "Convertible,City driving,Very important,Sporty,Luxury and infotainment": "Mazda MX-5 Miata",
    "Sedan,Long-distance travel,Very important,Comfort-oriented,Advanced safety features": "Honda Accord",
    "SUV,Daily commute,Moderately important,Comfort-oriented,Advanced safety features": "Toyota RAV4",
    "Truck,Daily commute,Not important,High performance,Basic features are fine": "Ram 1500",
    "Coupe,Daily commute,Not important,Sporty,Luxury and infotainment": "BMW 4 Series",
    "SUV,Off-road,Moderately important,Sporty,Advanced safety features": "Jeep Wrangler",
    "Convertible,Long-distance travel,Very important,Sporty,Luxury and infotainment": "BMW Z4",
    // Add more combinations based on research...
  };

  const generalizedRecommendations = {
    "Sedan": "Honda Accord, a versatile sedan with great efficiency and comfort.",
    "SUV": "Toyota RAV4, a reliable and popular choice for both families and commuters.",
    "Truck": "Ford F-150, America's best-selling truck for all-around performance.",
    "Coupe": "BMW 4 Series, for a balance of luxury, performance, and style.",
    "Convertible": "Mazda MX-5 Miata, a sporty and fun convertible with great handling."
  };

  let currentQuestionIndex = 0;
  let selectedAnswers = [];

  // Function to load a question
  function loadQuestion() {
    const questionData = questions[currentQuestionIndex];
    questionContainer.innerHTML = `
      <div class="question-card">
        <h2>${questionData.question}</h2>
        <div class="answer-options-container">
          ${questionData.answers.map(answer => `
            <div class="answer-option">
              ${answer.img ? `<img src="${answer.img}" alt="${answer.text}" class="answer-img">` : ''}
              <button class="answer-btn">${answer.text}</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  
    // Add click event listeners to answer buttons
    document.querySelectorAll('.answer-btn').forEach((button) => {
      button.addEventListener('click', function () {
        selectedAnswers.push(button.innerText);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          loadQuestion();
        } else {
          showResult();
        }
      });
    });
  }
  

  // Function to show the final result based on answers
  function showResult() {
    questionContainer.style.display = "none";
    resultContainer.style.display = "block";
    const resultKey = selectedAnswers.join(",");
    const recommendedCar = carRecommendations[resultKey];

    if (recommendedCar) {
      resultContainer.innerHTML = `
        <div class="result-title">Your Car Recommendation</div>
        <div class="result-car">${recommendedCar}</div>
        <div class="result-description">Based on your preferences, this car best matches your needs.</div>
      `;
    } else {
      const fallbackRecommendation = generalizedRecommendations[selectedAnswers[0]];  // Use the first answer (car type)
      resultContainer.innerHTML = `
        <div class="result-title">Your Car Recommendation</div>
        <div class="result-car">${fallbackRecommendation}</div>
        <div class="result-description">Based on your preferences, this car is a popular and versatile choice.</div>
      `;
    }
  }

  // Start the questionnaire by loading the first question
  loadQuestion();
});
