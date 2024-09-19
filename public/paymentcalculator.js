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
      // Variables
      // Set variables to 0 if it's not a number, float, or integer
      var carPrice = parseFloat(document.getElementById("carPrice").value) || 0;
      var loanTerm = parseInt(document.getElementById("loanTerm").value) || 60;
      var downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
      var tradeValue = parseFloat(document.getElementById("tradeValue").value) || 0;
      var tradeOwed = parseFloat(document.getElementById("tradeOwed").value) || 0;
      
      // Convert Rates
      var interestRate = (parseFloat(document.getElementById("interestRate").value) || 0) / 100; // Divides by 100 to convert to percentage
      var salesRate = (parseFloat(document.getElementById("salesTaxRate").value) || 0) / 100; // Divides by 100 to convert to percentage

      var interestRate_month = (interestRate) / 12;   // Interest rate per month

      /*  Calculate Sales Tax
          Sales Tax has its own formula apart from the Rate   */
      var salesTax = (carPrice) * (salesRate);

      /*  Calculate Total Finance  
          From: https://www.autotrader.com/car-payment-calculator   */
      let totalFinanced = (carPrice) + (salesTax) - (downPayment) - (tradeValue) + (tradeOwed);

      /*  Calculate Monthly Payment
          Formula for Monthly Payment was taken from these 2 websites:
            https://www.calculatorsoup.com/calculators/financial/loan-calculator.php
            https://www.rocketloans.com/learn/financial-smarts/how-to-calculate-monthly-payment-on-a-loan   */  
      let monthlyPayment;
      if (interestRate_month > 0) {
        monthlyPayment = totalFinanced * ((interestRate_month) * ((1 + interestRate_month) ** loanTerm)) / (((1 + interestRate_month) ** loanTerm) - 1);;
      } else {
        monthlyPayment = totalFinanced / loanTerm;
      }

      /*  Calculate Total Interest
          Formula: https://www.reddit.com/r/HelpMeFind/comments/12mtb62/what_does_est_total_interest_mean_im_confused/  */
      let totalInterest = (monthlyPayment * loanTerm) - (totalFinanced);
  
      // Calculate Total Loan
      let totalLoan = (totalFinanced) + (totalInterest);

      // Display the results
      document.getElementById("price").innerText = '$' + carPrice;
      document.getElementById("salesTax").innerText = "$" + Math.round(salesTax);
      document.getElementById("downPaymentDisplay").innerText = '$' + downPayment;
      document.getElementById("tradeInDisplay").innerText = '$' + tradeValue;
      document.getElementById("amountOwedDisplay").innerText = '$' + tradeOwed;
      document.getElementById("totalFinancedDisplay").innerText = '$' + Math.round(totalFinanced);
      document.getElementById("totalLoan").innerText = '$' + Math.round(totalLoan);
      document.getElementById("totalInterest").innerText = '$' + Math.round(totalInterest);
      document.querySelector(".calculator-results h3").textContent = `Est. Monthly Payment: $${monthlyPayment.toFixed(2)}/month`;
    }
  
// Function to calculate affordability (Affordability Calculator)
function calculateAffordability() {
    // Variables
    // Set variables to 0 if it's not a number, float, or integer
    var monthlyPayment = parseFloat(document.getElementById("preferredPayment").value) || 0;
    var affordLoanTerm = parseInt(document.getElementById("affordLoanTerm").value) || 60;
    var affordDownPayment = parseFloat(document.getElementById("affordDownPayment").value) || 0;
    var affordTradeValue = parseFloat(document.getElementById("affordTradeValue").value) || 0;
    var affordTradeOwed = parseFloat(document.getElementById("affordTradeOwed").value) || 0;

    // Convert Rates
    var affordInterestRate = (parseFloat(document.getElementById("affordInterestRate").value) || 0) / 100; // Divides by 100 to convert to percentage
    var affordSalesTaxRate = (parseFloat(document.getElementById("affordSalesTaxRate").value) || 0) / 100; // Divides by 100 to convert to percentage

    var interestRate_month = (affordInterestRate) / 12;   // Interest rate per month

    /*  Calculate Total Finance
        https://www.calculatorsoup.com/calculators/financial/loan-calculator.php  */
    let totalFinance;
    if (interestRate_month > 0) {
      totalFinance = (monthlyPayment / interestRate_month) * (1 - ((1) / ((1 + interestRate_month) ** affordLoanTerm)))
    } else { totalFinance = monthlyPayment * affordLoanTerm; }

    /* Calculate Total Loan
       totalFinance * affordLoanTerm  */
    var totalLoan = (monthlyPayment) * (affordLoanTerm);

    /* Calculate Sales Tax
       totalFinance * affordSalesTaxRate  */
    var salesTax = (totalFinance) * (affordSalesTaxRate);

    // Calculate Total Interest
    let totalInterest = (totalLoan) - (totalFinance);

    // Calculate Estimated Car Price
    let totalcarPrice = (totalFinance) - (salesTax) + (affordDownPayment) + (affordTradeValue) - (affordTradeOwed);

    // Display the results
    document.getElementById("affordEstCarPrice").textContent = `$${totalcarPrice.toFixed(2)}`;
    document.getElementById("preferredDisplay").innerText = '$' + monthlyPayment + '/month';
    document.getElementById("affordDownPaymentDisplay").innerText = '$' + affordDownPayment;
    document.getElementById("affordSalesTaxDisplay").innerText = '$' + Math.round(salesTax);
    document.getElementById("affordTradeInDisplay").innerText = '$' +  affordTradeValue;
    document.getElementById("affordTradeOwedDisplay").innerText = '$' + affordTradeOwed;
    document.getElementById("affordTotalFinanced").innerText = '$' + Math.round(totalFinance);
    document.getElementById("affordTotalInterest").innerText = '$' +  Math.round(totalInterest);
    document.getElementById("affordTotalLoan").innerText = '$' + totalLoan;
  }
  
  // Function to calculate the monthly lease payment (Lease Calculator)
  function calculateLease() {
    // Variables
    // Set variables to 0 if it's not a number, float, or integer
    var leaseCarPrice = parseFloat(document.getElementById("leaseCarPrice").value) || 0;
    var leaseTerm = parseInt(document.getElementById("leaseTerm").value) || 60;
    var leaseTradeValue = parseFloat(document.getElementById("leaseTradeValue").value) || 0;
    var leaseTradeOwed = parseFloat(document.getElementById("leaseTradeOwed").value) || 0;
    var leaseDownPayment = parseFloat(document.getElementById("leaseDownPayment").value) || 0;

    // Convert Rates
    var leaseInterestRate = (parseFloat(document.getElementById("leaseInterestRate").value) || 0) / 100; // Divides by 100 to convert to percentage
    var leaseSalesRate = (parseFloat(document.getElementById("leaseSalesTax").value) || 0) / 100; // Divides by 100 to convert to percentage
    var residualValue = (parseFloat(document.getElementById("residualValue").value) || 62.0) / 100;

    var interestRate_month = (leaseInterestRate) / 12;   // Interest rate per month

    // Convert to Residual
    var residualAmount = leaseCarPrice * (residualValue);
    
    /*
    var totalLeaseCost = leaseCarPrice - residualAmount;
    var monthlyLeasePayment = (totalLeaseCost / leaseTerm) + ((leaseInterestRate / 100) * totalLeaseCost / 12);
    */

    // Calculate Sales Tax
    var salesTax = (leaseCarPrice) * (leaseSalesRate);
    
    // Calculate Net Trade-In Amount
    var netTrade = (leaseTradeValue) - (leaseTradeOwed);

    // Calculate total Lease Amount
    let totalLease = (leaseCarPrice) + (salesTax) - (leaseDownPayment) - (netTrade);

    // Calculate Total Interest
    /*
    let monthlyPayment;
    if (interestRate_month > 0) {
      monthlyPayment = totalLease * ((interestRate_month) * ((1 + interestRate_month) ** leaseTerm)) / (((1 + interestRate_month) ** loanTerm) - 1);;
    } else { monthlyPayment = totalLease / leaseTerm; }
    */

    // let totalInterest = (monthlyPayment * leaseTerm) - (totalLease);
    let leaseTotalInterest = totalLease + residualAmount - leaseCarPrice;
    console.log("total Interest: " + leaseTotalInterest);

    // Display the results
    // document.getElementById("leaseEstMonthlyPayment").textContent = `$${monthlyLeasePayment.toFixed(2)}/month`;
    document.getElementById("leaseSalesDisplay").innerText = '$' + salesTax.toFixed(2);
    document.getElementById("leasePrice").innerText = '$' + leaseCarPrice;
    document.getElementById("netTradeDisplay").innerText = '$' + netTrade.toFixed(2);
    document.getElementById("leaseDownPaymentDisplay").innerText = '$' + leaseDownPayment.toFixed(2);

    // document.getElementById("leaseResidual").textContent = `$${residualAmount.toFixed(2)}`;
    document.getElementById("leaseTotalInterest").innerText = '$' + leaseTotalInterest.toFixed(2);
    document.getElementById("leaseTotal").textContent = `$${totalLease.toFixed(2)}`;
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
    document.getElementById("tradeValue").addEventListener("input", calculateLoanPayment);
    document.getElementById("tradeOwed").addEventListener("input", calculateLoanPayment);
  
    // Add event listeners for real-time updates in Affordability Calculator
    document.getElementById("preferredPayment").addEventListener("input", calculateAffordability);
    document.getElementById("affordInterestRate").addEventListener("input", calculateAffordability);
    document.getElementById("affordLoanTerm").addEventListener("change", calculateAffordability);
    document.getElementById("affordSalesTaxRate").addEventListener("input", calculateAffordability);
    document.getElementById("affordDownPayment").addEventListener("input", calculateAffordability);
    document.getElementById("affordTradeValue").addEventListener("input", calculateAffordability);
    document.getElementById("affordTradeOwed").addEventListener("input", calculateAffordability);
  
    // Add event listeners for real-time updates in Lease Calculator
    document.getElementById("leaseCarPrice").addEventListener("input", calculateLease);
    document.getElementById("leaseSalesTax").addEventListener("input", calculateLease);
    document.getElementById("leaseTerm").addEventListener("change", calculateLease);
    document.getElementById("leaseInterestRate").addEventListener("input", calculateLease);
    document.getElementById("leaseTradeValue").addEventListener("input", calculateLease);
    document.getElementById("leaseTradeOwed").addEventListener("input", calculateLease);
    document.getElementById("leaseDownPayment").addEventListener("input", calculateLease);
    document.getElementById("residualValue").addEventListener("input", calculateLease);
    document.getElementById("leaseMiles").addEventListener("input", calculateLease);
  
    // Show the default calculator on page load
    switchCalculator("finance");
  });
