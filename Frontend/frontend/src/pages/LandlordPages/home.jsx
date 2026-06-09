<<<<<<< HEAD:Frontend/frontend/src/pages/home.jsx
import React, { useState, useEffect } from "react";
import "../css/global.css";
import "../css/home.css";
import house from "../assets/house.jpg";
=======
import React from "react";
import "../../css/LandlordCss/home.css";
import house from "../../assets/house.jpg";
>>>>>>> kumar:Frontend/frontend/src/pages/LandlordPages/home.jsx

import { FiSearch, FiMapPin, FiHome, FiPlus, FiLogIn, FiLogOut, FiGrid } from "react-icons/fi";
import { MdApartment, MdOtherHouses } from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";
import { HiOutlineArrowRight } from "react-icons/hi";

<<<<<<< HEAD:Frontend/frontend/src/pages/home.jsx
import { useHomeLogic, exploreItems, stats, tags, popularCities } from "../scripts/home";
=======
import {
  useHomeLogic,
  exploreItems,
  stats,
  tags,
  popularCities,
} from "../../scripts/LandlordScripts/home";       
>>>>>>> kumar:Frontend/frontend/src/pages/LandlordPages/home.jsx

const exploreIcons = [
  <BiBuildingHouse size={24} />,
  <MdApartment size={24} />,
  <MdOtherHouses size={24} />,
  <FiHome size={24} />,
];

function Home() {
  const {
    role, activeTag, setActiveTag, searchQuery, setSearchQuery,
    goToAddProperty, goToSignIn, goToHome, goToRooms, goToAbout,
    goToProperties, goToAdminDashboard, handleCityClick,
    handleSearch, handleSearchKeyDown, handleLogout,
  } = useHomeLogic();

  const [logo, setLogo] = useState(localStorage.getItem('adminLogo') || null);

  useEffect(() => {
    const handleLogoChange = () => setLogo(localStorage.getItem('adminLogo'));
    window.addEventListener('logo-updated', handleLogoChange);
    return () => window.removeEventListener('logo-updated', handleLogoChange);
  }, []);

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo" onClick={goToHome}>
          {logo
            ? <img src={logo} alt="RoomFinder" style={{ height: 32, objectFit: 'contain', borderRadius: 6, marginRight: 8 }} />
            : <span className="logo-dot"></span>
          }
          RoomFinder
        </div>

        <nav className="nav-links">
          <button onClick={goToHome}>Home</button>
          <button onClick={goToRooms}>Rooms</button>
          <button onClick={goToAbout}>About</button>
        </nav>

        <div className="nav-actions">
          <button className="add-btn" onClick={goToAddProperty}>
            <FiPlus size={15} /> Add Property
          </button>

          {role === null && (
            <button className="login-btn" onClick={goToSignIn}>
              <FiLogIn size={15} /> Sign In
            </button>
          )}

          {role !== null && (
            <>
              <span className="nav-role-badge">{role}</span>

              {role === 'admin' && (
                <button className="add-btn" onClick={goToAdminDashboard}>
                  <FiGrid size={15} /> Admin Panel
                </button>
              )}

              <button className="login-btn" onClick={handleLogout}>
                <FiLogOut size={15} /> Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="hero" style={{ backgroundImage: `url(${house})` }}>
        <div className="hero-overlay">
          <p className="hero-label">🇳🇵 Nepal's #1 Rental Platform</p>
          <h1>Find Your Perfect <span className="hero-highlight">Room</span></h1>
          <p className="hero-sub">Discover rooms, flats and apartments near you</p>
          <div className="hero-tags">
            {tags.map(tag => (
              <button key={tag} className={`hero-tag ${activeTag === tag ? "active" : ""}`} onClick={() => setActiveTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
          <div className="search-bar">
            <FiMapPin className="search-icon" />
            <input
              type="text"
              placeholder="Search by city or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button className="search-btn" onClick={handleSearch}>
              <FiSearch size={15} /> Search
            </button>
          </div>
          <p className="popular-label">
            Popular:{" "}
            {popularCities.map((city, i) => (
              <span key={city} onClick={() => handleCityClick(city)}>
                {city}{i < popularCities.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        {stats.map((s, i) => (
          <React.Fragment key={i}>
            <div className="stat"><h3>{s.value}</h3><p>{s.label}</p></div>
            {i < stats.length - 1 && <div className="stat-divider" />}
          </React.Fragment>
        ))}
      </div>

      {/* EXPLORE SECTION */}
      <section className="explore-section">
        <div className="explore-header">
          <div>
            <h2>Explore Properties</h2>
            <p className="explore-sub">Browse by category and find your ideal space</p>
          </div>
          <button className="view-all-btn" onClick={() => goToProperties()}>
            View All <HiOutlineArrowRight size={15} style={{ marginLeft: 4, verticalAlign: "middle" }} />
          </button>
        </div>
        <div className="explore-grid">
          {exploreItems.map((item, i) => (
            <div className="explore-card" key={i} onClick={() => goToProperties(item.title)}>
              <div className="explore-icon" style={{ background: item.color, color: item.iconColor }}>
                {exploreIcons[i]}
              </div>
              <div className="explore-card-info">
                <h3>{item.title}</h3>
                <p>Browse listings →</p>
              </div>
              <HiOutlineArrowRight size={18} className="explore-arrow" style={{ color: item.iconColor }} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;