// Function to toggle input sections based on selected search type
function toggleInputSections() {
    const vinInput = document.getElementById('vin-inputs');
    const makeModelInput = document.getElementById('makeModel-inputs');
    const licensePlateInput = document.getElementById('licensePlate-inputs');
  
    // Get the selected search type
    const selectedSearchType = document.querySelector('input[name="searchType"]:checked').value;
  
    // Show/hide sections based on the selected search type
    if (selectedSearchType === 'VIN') {
      vinInput.style.display = 'block';
      makeModelInput.style.display = 'none';
      licensePlateInput.style.display = 'none';
    } else if (selectedSearchType === 'Make/Model') {
      vinInput.style.display = 'none';
      makeModelInput.style.display = 'block';
      licensePlateInput.style.display = 'none';
    } else if (selectedSearchType === 'LicensePlate') {
      vinInput.style.display = 'none';
      makeModelInput.style.display = 'none';
      licensePlateInput.style.display = 'block';
    }
  }
  
  // Add event listeners to radio buttons
  document.querySelectorAll('input[name="searchType"]').forEach(radio => {
    radio.addEventListener('change', toggleInputSections);
  });
  
  // Call the function on page load to set the initial state
  document.addEventListener('DOMContentLoaded', toggleInputSections);
  