import React, { useState, useEffect, useMemo } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import '../styles/ResultsPage.css';

const ResultsPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Define state for Autocomplete
  const [autocomplete, setAutocomplete] = useState(null);

  // Define filter states
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [zip, setZip] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [radius, setRadius] = useState(10); // Default distance in miles
  const [filteredCars, setFilteredCars] = useState([]);

  const sampleCars = useMemo(
    () => [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2018, price: 20000, mileage: 30000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90001', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Red', lat: 33.973951, lng: -118.248405, image: 'https://via.placeholder.com/280x180' },
      { id: 4, make: 'Honda', model: 'Civic', year: 2020, price: 18000, mileage: 20000, transmission: 'Manual', fuelType: 'Gasoline', location: '90002', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Blue', lat: 33.950396, lng: -118.247621, image: 'https://via.placeholder.com/280x180' },
      { id: 5, make: 'Toyota', model: 'Corolla', year: 2019, price: 15000, mileage: 25000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90003', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Gray', lat: 33.965495, lng: -118.261867, image: 'https://via.placeholder.com/280x180' },
      // Add more cars as necessary
    ],
    []
  );

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const postalCode = place?.address_components?.find((comp) =>
        comp.types.includes('postal_code')
      )?.short_name;

      if (postalCode && /^[0-9]{5}$/.test(postalCode)) {
        setZip(postalCode);
        console.log('Selected ZIP Code:', postalCode);
      } else {
        setZip(''); // Clear ZIP code if invalid
        console.log('Invalid ZIP code or incomplete location.');
      }
    }
  };

  // Filtering logic
  useEffect(() => {
    const filterCarsByDistance = async () => {
      let userCoordinates = null;

      if (zip && /^[0-9]{5}$/.test(zip)) {
        const geocoder = new window.google.maps.Geocoder();
        try {
          const result = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: zip }, (results, status) => {
              if (status === 'OK') {
                resolve(results[0].geometry.location);
              } else if (status === 'ZERO_RESULTS') {
                console.log(`No location found for ZIP code: ${zip}`);
                resolve(null); // Gracefully handle no results
              } else {
                reject(`Geocode failed due to: ${status}`);
              }
            });
          });

          if (result) {
            userCoordinates = { lat: result.lat(), lng: result.lng() };
          }
        } catch (error) {
          console.error(error);
          return;
        }
      }

      const newFilteredCars = sampleCars.filter((car) => {
        const matchesMake = !make || car.make === make;
        const matchesModel = !model || car.model === model;
        const matchesMinYear = !minYear || car.year >= parseInt(minYear, 10);
        const matchesMaxYear = !maxYear || car.year <= parseInt(maxYear, 10);
        const matchesMinPrice = !minPrice || car.price >= parseInt(minPrice, 10);
        const matchesMaxPrice = !maxPrice || car.price <= parseInt(maxPrice, 10);

        let withinDistance = true;
        if (userCoordinates) {
          const distance = calculateDistance(
            userCoordinates.lat,
            userCoordinates.lng,
            car.lat,
            car.lng
          );
          withinDistance = distance <= radius;
        }

        return (
          matchesMake &&
          matchesModel &&
          matchesMinYear &&
          matchesMaxYear &&
          matchesMinPrice &&
          matchesMaxPrice &&
          withinDistance
        );
      });

      setFilteredCars(newFilteredCars);
    };

    filterCarsByDistance();
  }, [make, model, zip, minYear, maxYear, minPrice, maxPrice, radius, sampleCars]);

  if (!isLoaded) {
    return <p>Loading Google Maps...</p>;
  }

  return (
    <div className="results-page">
      <h2 className="results-title">Search Results</h2>
      <div className="results-container">
        <div className="filter-panel">
          <div className="form-section">
            <label>Make:</label>
            <select
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel(''); // Reset model when make changes
              }}
            >
              <option value="">Any</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              {/* Add more makes */}
            </select>
          </div>

          <div className="form-section">
            <label>Model:</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make} // Disable model selection if no make is selected
            >
              <option value="">Any</option>
              {make === 'Toyota' && (
                <>
                  <option value="Camry">Camry</option>
                  <option value="Corolla">Corolla</option>
                  {/* Add more Toyota models */}
                </>
              )}
              {make === 'Honda' && (
                <>
                  <option value="Civic">Civic</option>
                  {/* Add more Honda models */}
                </>
              )}
              {/* Add more makes and their models */}
            </select>
          </div>

          <div className="form-section">
            <label>ZIP Code:</label>
            <Autocomplete
              onLoad={(instance) => setAutocomplete(instance)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                placeholder="Enter ZIP code or location"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </Autocomplete>
          </div>

          <div className="form-section">
            <label>Distance (miles):</label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              {[10, 25, 50, 100, 250, 500, 1000].map((distance) => (
                <option key={distance} value={distance}>
                  {distance} miles
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Year Range:</label>
            <input
              type="number"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              placeholder="Min Year"
            />
            <input
              type="number"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              placeholder="Max Year"
            />
          </div>

          <div className="form-section">
            <label>Price Range:</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
            />
          </div>
        </div>

        <div className="vehicle-list">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div key={car.id} className="vehicle-card">
                <img src={car.image} alt={`${car.make} ${car.model}`} />
                <h3>
                  {car.year} {car.make} {car.model}
                </h3>
                <p>Price: ${car.price}</p>
                <p>Mileage: {car.mileage} miles</p>
                <p>Location: {car.location}</p>
              </div>
            ))
          ) : (
            <p>No results found for the given criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;