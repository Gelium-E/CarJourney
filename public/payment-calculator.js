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
document.getElementById('register-password').addEventListener('input', function () {
  validatePasswordRealTime(this.value);
});

// Register Form Submission
document.getElementById('register-form').addEventListener('submit', function (event) {
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

  // Firebase sign-up logic
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Send email verification after registration
      sendEmailVerification(user).then(() => {
        showError(errorContainer, 'Verification email sent! Please check your inbox.');
      }).catch(error => {
        showError(errorContainer, "Error sending verification email.");
      });
    })
    .catch((error) => {
      showError(errorContainer, `Registration failed: ${error.message}`);
    });
});

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form from submitting the default way

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorContainer = document.getElementById('login-error'); // Error message container

  // Clear previous error messages
  showError(errorContainer, "");

  // Firebase sign-in logic
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Check if the user is verified
      if (user.emailVerified) {
        showError(errorContainer, 'Login successful!');
        document.getElementById('login-modal').style.display = 'none'; // Close modal
      } else {
        showError(errorContainer, 'Please verify your email before logging in.');
      }
    })
    .catch((error) => {
      showError(errorContainer, `Login failed: ${error.message}`);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Function to switch between calculator tabs
    function switchCalculator(type) {
      // Hide all calculators
      document.querySelectorAll(".calculator-form").forEach(form => form.style.display = "none");
  
      // Remove 'active' class from all buttons
      document.querySelectorAll(".tabs button").forEach(button => button.classList.remove("active"));
  
      // Show the selected calculator and add 'active' class to the clicked tab
      document.getElementById(`${type}-calculator`).style.display = "flex";
      document.getElementById(`${type}-tab`).classList.add("active");
  
      // Trigger initial calculation based on the selected tab
      if (type === "finance") {
        calculateLoanPayment();
      } else if (type === "affordability") {
        calculateAffordability();
      } else if (type === "lease") {
        calculateLease();
      }
    }
  
    // Function to calculate the monthly loan payment (Finance Calculator)
    function calculateLoanPayment() {
      const carPrice = parseFloat(document.getElementById("carPrice").value) || 0;
      const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
      const loanTerm = parseInt(document.getElementById("loanTerm").value) || 60;
      const salesTaxRate = parseFloat(document.getElementById("salesTaxRate").value) || 0;
      const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
      const tradeInValue = parseFloat(document.getElementById("tradeInValue").value) || 0;
      const amountOwedOnTrade = parseFloat(document.getElementById("amountOwedOnTrade").value) || 0;
  
      const salesTax = (carPrice * salesTaxRate) / 100;
      const totalFinanced = carPrice + salesTax - downPayment - tradeInValue + amountOwedOnTrade;
      const monthlyInterestRate = (interestRate / 100) / 12;
      const numberOfPayments = loanTerm;
  
      let monthlyPayment;
      if (monthlyInterestRate > 0) {
        monthlyPayment = (totalFinanced * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      } else {
        monthlyPayment = totalFinanced / loanTerm;
      }
  
      // Display the results
      document.getElementById("price").textContent = `$${carPrice.toLocaleString()}`;
      document.getElementById("salesTax").textContent = `$${salesTax.toLocaleString()}`;
      document.getElementById("downPaymentDisplay").textContent = `$${downPayment.toLocaleString()}`;
      document.getElementById("tradeInDisplay").textContent = `$${tradeInValue.toLocaleString()}`;
      document.getElementById("amountOwedDisplay").textContent = `$${amountOwedOnTrade.toLocaleString()}`;
      document.getElementById("totalFinanced").textContent = `$${totalFinanced.toLocaleString()}`;
      document.getElementById("totalLoan").textContent = `$${totalFinanced.toLocaleString()}`;
      document.getElementById("totalInterest").textContent = `$${(monthlyPayment * loanTerm - totalFinanced).toLocaleString()}`;
      document.querySelector(".calculator-results h3").textContent = `Est. Monthly Payment: $${monthlyPayment.toFixed(2)}/month`;
    }
  
// Function to calculate affordability (Affordability Calculator)
function calculateAffordability() {
    const preferredPayment = parseFloat(document.getElementById("preferredPayment").value) || 0;
    const affordInterestRate = parseFloat(document.getElementById("affordInterestRate").value) || 0;
    const affordLoanTerm = parseInt(document.getElementById("affordLoanTerm").value) || 60;
    const affordDownPayment = parseFloat(document.getElementById("affordDownPayment").value) || 0;
    const affordSalesTaxRate = parseFloat(document.getElementById("affordSalesTaxRate").value) || 0;
  
    const monthlyInterestRate = (affordInterestRate / 100) / 12;
    const numberOfPayments = affordLoanTerm;
  
    let financedAmount;
    if (monthlyInterestRate > 0) {
      financedAmount = preferredPayment / ((monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1));
    } else {
      financedAmount = preferredPayment * numberOfPayments;
    }
  
    const totalCarPrice = financedAmount + affordDownPayment + (financedAmount * affordSalesTaxRate / 100);
  
    // Display the results
    document.getElementById("affordEstCarPrice").textContent = `$${totalCarPrice.toFixed(2)}`;
    document.getElementById("preferredDisplay").textContent = `$${preferredPayment.toFixed(2)}`;
    document.getElementById("affordDownPaymentDisplay").textContent = `$${affordDownPayment.toFixed(2)}`;
    document.getElementById("affordSalesTax").textContent = `$${(financedAmount * affordSalesTaxRate / 100).toFixed(2)}`;
    document.getElementById("affordTotalFinanced").textContent = `$${totalCarPrice.toLocaleString()}`;
  }
  
  // Function to calculate the monthly lease payment (Lease Calculator)
  function calculateLease() {
    const leaseCarPrice = parseFloat(document.getElementById("leaseCarPrice").value) || 0;
    const leaseInterestRate = parseFloat(document.getElementById("leaseInterestRate").value) || 0;
    const leaseTerm = parseInt(document.getElementById("leaseTerm").value) || 60;
    const residualValue = parseFloat(document.getElementById("residualValue").value) || 62.0;
  
    const residualAmount = leaseCarPrice * (residualValue / 100);
    const totalLeaseCost = leaseCarPrice - residualAmount;
    const monthlyLeasePayment = (totalLeaseCost / leaseTerm) + ((leaseInterestRate / 100) * totalLeaseCost / 12);
  
    // Display the results
    document.getElementById("leaseEstMonthlyPayment").textContent = `$${monthlyLeasePayment.toFixed(2)}/month`;
    document.getElementById("leasePrice").textContent = `$${leaseCarPrice.toFixed(2)}`;
    document.getElementById("leaseResidual").textContent = `$${residualAmount.toFixed(2)}`;
    document.getElementById("leaseTotal").textContent = `$${totalLeaseCost.toFixed(2)}`;
  }
  
    // Event listeners for switching between tabs
    document.getElementById("finance-tab").addEventListener("click", function () {
      switchCalculator("finance");
    });
    document.getElementById("affordability-tab").addEventListener("click", function () {
      switchCalculator("affordability");
    });
    document.getElementById("lease-tab").addEventListener("click", function () {
      switchCalculator("lease");
    });
  
    // Add event listeners for real-time updates in Finance Calculator
    document.getElementById("carPrice").addEventListener("input", calculateLoanPayment);
    document.getElementById("interestRate").addEventListener("input", calculateLoanPayment);
    document.getElementById("loanTerm").addEventListener("change", calculateLoanPayment);
    document.getElementById("salesTaxRate").addEventListener("input", calculateLoanPayment);
    document.getElementById("downPayment").addEventListener("input", calculateLoanPayment);
    document.getElementById("tradeInValue").addEventListener("input", calculateLoanPayment);
    document.getElementById("amountOwedOnTrade").addEventListener("input", calculateLoanPayment);
  
    // Add event listeners for real-time updates in Affordability Calculator
    document.getElementById("preferredPayment").addEventListener("input", calculateAffordability);
    document.getElementById("affordInterestRate").addEventListener("input", calculateAffordability);
    document.getElementById("affordLoanTerm").addEventListener("change", calculateAffordability);
    document.getElementById("affordSalesTaxRate").addEventListener("input", calculateAffordability);
    document.getElementById("affordDownPayment").addEventListener("input", calculateAffordability);
  
    // Add event listeners for real-time updates in Lease Calculator
    document.getElementById("leaseCarPrice").addEventListener("input", calculateLease);
    document.getElementById("leaseInterestRate").addEventListener("input", calculateLease);
    document.getElementById("leaseTerm").addEventListener("change", calculateLease);
    document.getElementById("residualValue").addEventListener("input", calculateLease);
    document.getElementById("leaseMiles").addEventListener("input", calculateLease);
  
    // Show the default calculator on page load
    switchCalculator("finance");
  });
