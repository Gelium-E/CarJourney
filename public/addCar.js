document.addEventListener("DOMContentLoaded", function() {
    const vinRadio = document.getElementById("vin");
    const makeModelRadio = document.getElementById("makeModel");
    const licensePlateRadio = document.getElementById("licensePlate");
  
    const vinSection = document.getElementById("vin-inputs");
    const makeModelSection = document.getElementById("makeModel-inputs");
    const licensePlateSection = document.getElementById("licensePlate-inputs");
  
    // Function to show/hide sections
    function toggleSections() {
      if (vinRadio.checked) {
        vinSection.style.display = "block";
        makeModelSection.style.display = "none";
        licensePlateSection.style.display = "none";
      } else if (makeModelRadio.checked) {
        vinSection.style.display = "none";
        makeModelSection.style.display = "block";
        licensePlateSection.style.display = "none";
      } else if (licensePlateRadio.checked) {
        vinSection.style.display = "none";
        makeModelSection.style.display = "none";
        licensePlateSection.style.display = "block";
      }
    }
  
    // Add event listeners to radio buttons
    vinRadio.addEventListener("change", toggleSections);
    makeModelRadio.addEventListener("change", toggleSections);
    licensePlateRadio.addEventListener("change", toggleSections);
  
    // Initialize the correct section
    toggleSections();
  });
  