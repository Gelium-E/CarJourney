// Image gallery images 
const carImages = [
  "images/camry1.jpg", 
  "images/camry2.jpg", 
  "images/camry3.jpg",
  "images/camry4.jpg",
  "images/camry5.jpg",
  "images/camry6.jpg"   
];

let currentIndex = 0;

// Function to update the displayed image
function updateImage() {
  const imageElement = document.getElementById("car-image");
  if (imageElement) {
    imageElement.src = carImages[currentIndex]; //Update the src of the image to the current image
  }
}

// Go to the previous image
function prevImage() {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : carImages.length - 1; //Cycle back to the last image
  updateImage();
}

// Go to the next image
function nextImage() {
  currentIndex = (currentIndex < carImages.length - 1) ? currentIndex + 1 : 0; //Cycle to the first image after the last one
  updateImage();
}

// Initialize gallery with the first image
window.onload = function() {
  updateImage();
};

