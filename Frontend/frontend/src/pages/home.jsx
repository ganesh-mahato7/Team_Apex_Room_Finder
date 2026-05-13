import React from "react";
import "./home.css";
import { addProperty } from "../script/home";

function Home() {
  return (
    <div className="home-container">
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
    </div>
  );
}

export default Home;