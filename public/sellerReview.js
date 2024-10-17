document.addEventListener("DOMContentLoaded", () => {
  const sampleReviews = [
      {
          rating: 5,
          text: "I found the perfect car through CarJourney! Highly recommended.",
          name: "John D.",
          date: "2024-10-10"
      },
      {
          rating: 4,
          text: "Smooth process, found a great deal. I will definitely come back.",
          name: "Emily S.",
          date: "2024-09-25"
      },
      {
          rating: 3,
          text: "Overall okay, but the car selection could be better.",
          name: "David B.",
          date: "2024-08-15"
      },
      {
          rating: 5,
          text: "Excellent service and quick process. I highly recommend it!",
          name: "Sophia W.",
          date: "2024-07-20"
      },
      {
          rating: 4,
          text: "Found a reliable car and the experience was easy and transparent.",
          name: "Michael R.",
          date: "2024-09-12"
      },
      {
          rating: 2,
          text: "The search was fine, but I didn’t find many good deals in my area.",
          name: "Alice K.",
          date: "2024-06-28"
      },
      {
          rating: 5,
          text: "Super easy process. Got my dream car within a week!",
          name: "Robert T.",
          date: "2024-07-02"
      },
      {
          rating: 4,
          text: "Good experience overall, though the filters could be more specific.",
          name: "Linda G.",
          date: "2024-05-18"
      },
      {
          rating: 3,
          text: "It was okay, but I wish there were more financing options.",
          name: "Sarah H.",
          date: "2024-04-30"
      },
      {
          rating: 1,
          text: "Didn't find any cars in my price range. It was disappointing.",
          name: "George P.",
          date: "2024-03-10"
      },
      {
          rating: 5,
          text: "Incredible customer service and the best car-buying experience I've had!",
          name: "Laura B.",
          date: "2024-08-05"
      },
      {
          rating: 4,
          text: "I love the interface, and I found a great deal on a used car.",
          name: "Chris J.",
          date: "2024-09-19"
      },
      {
          rating: 2,
          text: "Not a lot of options for electric cars in my area.",
          name: "Daniel F.",
          date: "2024-07-07"
      },
      {
          rating: 5,
          text: "I was able to trade in my old car easily and get a fantastic new one.",
          name: "Jessica M.",
          date: "2024-06-15"
      },
      {
          rating: 3,
          text: "Decent experience, but the process took longer than I expected.",
          name: "Henry L.",
          date: "2024-05-03"
      }
  ];

  function displayReviews(reviews) {
      const reviewsContainer = document.querySelector('.review-list');
      if (!reviewsContainer) {
          console.error("No review container found.");
          return;
      }

      reviewsContainer.innerHTML = ''; // Clear previous reviews

      reviews.forEach(review => {
          const reviewHTML = `
          <div class="review">
              <span class="review-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
              <p>${review.text}</p>
              <span class="review-name">- ${review.name}</span>
              <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
          </div>
          `;
          reviewsContainer.innerHTML += reviewHTML;
      });
  }

  // Initial display of all reviews
  displayReviews(sampleReviews);

  // Function to filter by star rating
  function filterByRating(reviews, rating) {
      if (rating === 'all') return reviews;
      return reviews.filter(review => review.rating === parseInt(rating));
  }

  // Function to filter by date (recent or oldest)
  function filterByDate(reviews, filter) {
      if (filter === 'recent') {
          return reviews.sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
      } else if (filter === 'oldest') {
          return reviews.sort((a, b) => new Date(a.date) - new Date(b.date)); // Oldest first
      }
      return reviews;
  }

  // Event listener for the star rating filter
  document.getElementById('filter-rating').addEventListener('change', (event) => {
      const selectedRating = event.target.value;
      const filteredReviews = filterByRating(sampleReviews, selectedRating);
      const selectedDateFilter = document.getElementById('filter-date').value;
      const finalReviews = filterByDate(filteredReviews, selectedDateFilter);
      displayReviews(finalReviews);
  });

  // Event listener for the date filter
  document.getElementById('filter-date').addEventListener('change', (event) => {
      const selectedDateFilter = event.target.value;
      const selectedRating = document.getElementById('filter-rating').value;
      const filteredReviews = filterByRating(sampleReviews, selectedRating);
      const finalReviews = filterByDate(filteredReviews, selectedDateFilter);
      displayReviews(finalReviews);
  });
});
