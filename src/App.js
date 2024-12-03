// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactSeller from "./pages/ContactSeller";
import CustomerTestimonials from "./pages/CustomerTestimonials";
import CarComparison from "./pages/CarComparison";
import CarDifferencesMenu from "./pages/CarDifferencesMenu";
import './styles/Footer.css'; // Ensure CSS is imported to apply the styles

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Garage = lazy(() => import('./pages/Garage'));
const User = lazy(() => import('./pages/User'));
const CarQuiz = lazy(() => import('./pages/Car-Quiz'));
const LocateDealer = lazy(() => import('./pages/LocateDealer'));
const CarListingPage = lazy(() => import('./pages/CarListingPage')); // New CarListingPage

function App() {
  return (
    <Router>
      <div className="content-wrap">
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/user" element={<User />} />
              <Route path="/car-quiz" element={<CarQuiz />} />
              <Route path="/locate-dealer" element={<LocateDealer />} />
              <Route path="/car-listing" element={<CarListingPage />} /> {/* New Route */}
              <Route path="/contact-seller" element={<ContactSeller />} />
              <Route path="/customer-testimonials" element={<CustomerTestimonials />} />
              <Route path="/compare-menu" element={<CarDifferencesMenu />} />
              <Route path="/compare" element={<CarComparison />} />
            </Routes>
          </div>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
