import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  const addProperty = () => {
    navigate("/add-property");
  };

  return (
    <div className="home-container">
      
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <div className="diamond"></div>
          <h2>Nepal Rental App</h2>
        </div>

        <div className="menu">
          <a href="#">Room</a>
          <a href="#">Apartment</a>
          <a href="#">Flat</a>
        </div>

        <div className="actions">
          <button className="add-btn" onClick={addProperty}>
            Add Property +
          </button>
          <a href="#" className="signin">Sign In</a>
        </div>
      </header>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-box">
          <p className="search-title">What are You Looking for ?</p>
          <input
            type="text"
            placeholder="Search for Places, Property Types....."
            className="search-input"
          />
        </div>
      </div>

    </div>
  );
}

export default Home;