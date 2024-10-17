import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch review data from Firestore
async function fetchReviewData() {
  const reviewRef = doc(db, "reviews", "reviewSummary");
  const reviewDoc = await getDoc(reviewRef);

  if (reviewDoc.exists()) {
    const data = reviewDoc.data();
    
    // Update average rating and total reviews
    document.querySelector('.rating-number').textContent = `${data.averageRating} out of 5`;
    document.querySelector('.total-ratings').textContent = `${data.totalReviews} global ratings`;

    // Update star rating breakdown
    const starPercentages = data.starPercentages;
    document.querySelectorAll('.filled-bar').forEach((bar, index) => {
      bar.style.width = `${starPercentages[index]}%`;
    });

    // Populate recent reviews
    const recentReviews = data.recentReviews;
    const reviewsContainer = document.querySelector('.user-review');
    reviewsContainer.innerHTML = '<h3>Recent Reviews</h3>';
    recentReviews.forEach(review => {
      const reviewHTML = `
        <div class="review">
          <span class="review-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
          <p>${review.text}</p>
          <span class="review-date">${review.date}</span>
        </div>
      `;
      reviewsContainer.innerHTML += reviewHTML;
    });
  } else {
    console.log("No review data found");
  }
}

fetchReviewData();
