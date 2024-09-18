// Image gallery images (ensure these paths are correct in your project)
const carImages = [
  "images/camry1.jpg",  // Path to camry1.jpg
  "images/camry2.jpg",  // Path to camry2.jpg
  "images/camry3.jpg"   // Path to camry3.jpg
];

let currentIndex = 0;

// Function to update the displayed image
function updateImage() {
  const imageElement = document.getElementById("car-image");
  if (imageElement) {
    imageElement.src = carImages[currentIndex]; // Update the src of the image to the current image
  }
}

// Go to the previous image
function prevImage() {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : carImages.length - 1; // Cycle back to the last image
  updateImage();
}

// Go to the next image
function nextImage() {
  currentIndex = (currentIndex < carImages.length - 1) ? currentIndex + 1 : 0; // Cycle to the first image after the last one
  updateImage();
}

// Initialize gallery with the first image
window.onload = function() {
  updateImage();
};

// Toggle heart icon between outlined and filled on click
const heartIcon = document.getElementById('heart-icon');

heartIcon.addEventListener('click', function () {
  // Check the current class and toggle between outlined and filled heart
  if (heartIcon.classList.contains('far')) {
    heartIcon.classList.remove('far'); // Remove the outlined heart class
    heartIcon.classList.add('fas');    // Add the filled heart class
  } else {
    heartIcon.classList.remove('fas'); // Remove the filled heart class
    heartIcon.classList.add('far');    // Add the outlined heart class
  }
});

