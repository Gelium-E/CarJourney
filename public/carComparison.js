// Fetch car 1 and car 2 details from localStorage
const car1 = JSON.parse(localStorage.getItem('car1'));
const car2 = JSON.parse(localStorage.getItem('car2'));

// Populate the fields in the comparison table
if (car1 && car2) {
  document.getElementById('car1-make-model').innerText = `${car1.make} ${car1.model}`;
  document.getElementById('car1-details').innerText = `${car1.model} Sedan\nNew ${car1.year}`;
  
  document.getElementById('car2-make-model').innerText = `${car2.make} ${car2.model}`;
  document.getElementById('car2-details').innerText = `${car2.model} Sedan\nNew ${car2.year}`;
  
  document.getElementById('car1-price').innerText = "$27,515"; // Example price, replace with dynamic data if needed
  document.getElementById('car2-price').innerText = "$27,510"; // Example price, replace with dynamic data if needed

  document.getElementById('car1-mpg').innerText = "City 28/Hwy 39/Comb 32 MPG"; // Example MPG
  document.getElementById('car2-mpg').innerText = "City 27/Hwy 39/Comb 32 MPG"; // Example MPG
  
  // Add other fields as necessary (fuel type, seating capacity, horsepower, etc.)
}
