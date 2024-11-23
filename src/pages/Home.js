import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Chatbot from "../components/Chatbot"; // Import the chatbot component

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        <h1>CarJourney</h1>
        <p>Your trusted companion for everything cars!</p>
      </div>
      <div className="chatbotSection">
        <h2>Need Help?</h2>
        <Chatbot /> {/* Include the chatbot component */}
      </div>
    </div>
  );
}

export default Home;
