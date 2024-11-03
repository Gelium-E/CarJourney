import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../AuthContext'; // Ensure you have this
import { db } from '../firebase'; // Import your Firestore configuration
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Add doc and deleteDoc here

export default function Garage() {
  const { currentUser } = useContext(AuthContext); // Get the current user
  const userId = currentUser ? currentUser.uid : null;
  
  const [cars, setCars] = useState([]); // State to store cars from Firestore
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    mileage: '',
    imageUrl: '',
  });
  const [selectedCar, setSelectedCar] = useState(null);

  // Fetch cars for the logged-in user from Firestore
  useEffect(() => {
    if (currentUser) {
      const fetchCars = async () => {
        const carCollection = collection(db, 'cars'); // Your Firestore collection name
        const q = query(carCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userCars = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCars(userCars); // Set the fetched cars
      };
      fetchCars();
    }
  }, [currentUser]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prevCar) => ({ ...prevCar, [name]: value }));
  };

  // Adds a new car to Firestore
  const handleAddCar = async () => {
    if (currentUser) {
      try {
        const carCollection = collection(db, 'carList');
        await addDoc(carCollection, {
          ...newCar,
          userId: currentUser.uid, // Have car be associated with the current user 
        });
        
        // Refresh the car list
        setCars((prevCars) => [...prevCars, { ...newCar, id: Math.random().toString() }]); 
        setNewCar({ make: '', model: '', year: '', color: '', mileage: '', imageUrl: '' }); 
      } catch (error) {
        console.error('Error adding car:', error);
      }
    }
  };

   // Delete car from Firestore and remove from UI
   const handleDeleteCar = async (carId) => {
    try {
      const carDocRef = doc(db, 'cars', carId); // Reference to the car document
      await deleteDoc(carDocRef); // Delete the document from Firestore
      // Update the UI by removing the deleted car
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const handleCloseDetails = () => {
    setSelectedCar(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* TITLE OF MAIN AREA */}
      <Typography variant="h4" component="h1" gutterBottom>
        My Car Garage
      </Typography>

      {/* FORM TO ADD A NEW CAR */}
      <Box component={Paper} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add a New Car
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Make"
            name="make"
            value={newCar.make}
            onChange={handleInputChange}
          />
          <TextField
            label="Model"
            name="model"
            value={newCar.model}
            onChange={handleInputChange}
          />
          <TextField
            label="Year"
            name="year"
            value={newCar.year}
            onChange={handleInputChange}
          />
          <TextField
            label="Color"
            name="color"
            value={newCar.color}
            onChange={handleInputChange}
          />
          <TextField
            label="Mileage"
            name="mileage"
            value={newCar.mileage}
            onChange={handleInputChange}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={newCar.imageUrl}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleAddCar}>
            Add Car
          </Button>
        </Box>
      </Box>

      {/* CONTAINER FOR LISTS AND DETAILS */}
      <Box sx={{ display: 'flex', mt: 2 }}>
        {/* Left side: List of cars */}
        <Box
          sx={{
            width: '40%',
            mr: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box component={Paper} sx={{ height: 400, overflowY: 'auto' }}>
            {/* CARS LIST */}
            <List>
              {cars.map((car, index) => (
                <React.Fragment key={car.id}>
                  <ListItem
                    button
                    onClick={() => handleCarClick(car)}
                    sx={{
                      backgroundColor:
                        selectedCar && selectedCar.id === car.id ? 'lightblue' : 'transparent',
                    }}
                  >
                    <ListItemAvatar sx={{ pr: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={car.imageUrl || 'https://via.placeholder.com/56x56?text=No+Image'}
                          alt={`${car.make} ${car.model}`}
                          sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${car.year} ${car.make} ${car.model}`}
                      secondary={`Mileage: ${car.mileage} miles`}
                    />

                    {/* Trash Icon for Deleting */}
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCar(car.id)}>
                      <DeleteIcon />
                    </IconButton>

                  </ListItem>
                  {index < cars.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>

        {/* CAR DETAILS BOX */}
        <Box sx={{ width: '60%' }}>
          {selectedCar ? (
            <Paper sx={{ p: 2, position: 'relative' }}>
              <IconButton
                aria-label="close"
                onClick={handleCloseDetails}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {/* Car Image */}
              <Box
                component="img"
                src={selectedCar.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={`${selectedCar.make} ${selectedCar.model}`}
                sx={{
                  width: 400,
                  height: 300,
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto 16px',
                }}
              />

              <Typography variant="h5" component="h2" gutterBottom>
                Car Details
              </Typography>
              <Typography variant="body1">
                <strong>Make:</strong> {selectedCar.make}
              </Typography>
              <Typography variant="body1">
                <strong>Model:</strong> {selectedCar.model}
              </Typography>
              <Typography variant="body1">
                <strong>Year:</strong> {selectedCar.year}
              </Typography>
              <Typography variant="body1">
                <strong>Color:</strong> {selectedCar.color}
              </Typography>
              <Typography variant="body1">
                <strong>Mileage:</strong> {selectedCar.mileage} miles
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Select a car to view details
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
