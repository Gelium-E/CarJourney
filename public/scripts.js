// Toggle heart icon between empty and filled (FontAwesome)
document.getElementById("heart-icon").addEventListener("click", function() {
  const heartIcon = document.getElementById("heart-icon");
  heartIcon.classList.toggle("fas");  // Filled heart
  heartIcon.classList.toggle("far");  // Empty heart
});

// Image gallery images (you can update these paths)
const carImages = [
  "/path/to/camry1.jpg",  // Replace with actual paths
  "/path/to/camry2.jpg",
  "/path/to/camry3.jpg"
];

let currentIndex = 0;

// Function to update the displayed image
function updateImage() {
  const imageElement = document.getElementById("car-image");
  if (imageElement) {
    imageElement.src = carImages[currentIndex];
  }
}

// Go to the previous image
function prevImage() {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : carImages.length - 1;
  updateImage();
}

// Go to the next image
function nextImage() {
  currentIndex = (currentIndex < carImages.length - 1) ? currentIndex + 1 : 0;
  updateImage();
}

// Initialize gallery with the first image
window.onload = function() {
  updateImage();
};
