// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Garage from './pages/Garage';
import User from './pages/User';
import CarQuiz from './pages/Car-Quiz';
import LocateDealer from './pages/LocateDealer';
import CarSearchPage from './pages/CarSearchPage';
import ResultsPage from './pages/ResultsPage'; // Import for ResultsPage component
import AdvancedSearchPage from './pages/AdvancedSearchPage'; // Import for AdvancedSearchPage component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/user" element={<User />} />
        <Route path="/car-quiz" element={<CarQuiz />} />
        <Route path="/locate-dealer" element={<LocateDealer />} />
        <Route path="/search" element={<CarSearchPage />} />
        <Route path="/results" element={<ResultsPage />} /> {/* Route for ResultsPage */}
        <Route path="/advanced-search" element={<AdvancedSearchPage />} /> {/* Route for AdvancedSearchPage */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
