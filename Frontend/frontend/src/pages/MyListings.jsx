import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Landlordglobal.css";
import "../css/Mylisting.css";

import {
  FiHome,
  FiGrid,
  FiPlus,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiShield,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiBell,
  FiMessageSquare,
  FiMapPin,
} from "react-icons/fi";

// ── Data ─────────────────────────────────────────────────────────────────────

const listings = [
  {
    status: "available",
    type: "Apartment",
    title: "2BHK Apartment, Kathmandu",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 15,000",
  },
  {
    status: "rented",
    type: "Room",
    title: "Single Room, Lalitpur",
    location: "Pulchowk, Lalitpur",
    price: "Rs. 8,000",
  },
  {
    status: "available",
    type: "Flat",
    title: "3BHK Flat, Bhaktapur",
    location: "Suryabinayak, Bhaktapur",
    price: "Rs. 22,000",
  },
];

// ── NavItem ───────────────────────────────────────────────────────────────────

function NavItem({ icon, label, badge, badgeClass = "", active, onClick }) {
  return (
    <button className={`nav-item${active ? " active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {badge && (
        <span className={`badge${badgeClass ? ` ${badgeClass}` : ""}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function MyListings() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("My Listings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

   const goToMessages = () => {
    navigate("/Messages");     // Make sure this matches your route
  };

  return (
    <div className="dashboard-container">

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>

        <div className="logo">
          <div className="logo-icon">
            <FiHome size={22} />
          </div>
          <span className="logo-text">RoomFinder</span>
        </div>

        <nav className="nav-menu">

          <div className="nav-section">
            <span className="nav-section-title">MAIN</span>
            <NavItem
              icon={<FiGrid size={15} />}
              label="Dashboard"
              active={activeNav === "Dashboard"}
              onClick={() => { setActiveNav("Dashboard"); navigate("/"); }}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">LISTINGS</span>
            <NavItem
              icon={<FiHome size={15} />}
              label="My Listings"
              badge="12"
              active={activeNav === "My Listings"}
              onClick={() => setActiveNav("My Listings")}
            />
            <NavItem
              icon={<FiPlus size={15} />}
              label="Add New Listing"
              active={activeNav === "Add New Listing"}
              onClick={() => { setActiveNav("Add New Listing"); navigate("/add-property"); }}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">BOOKINGS</span>
            <NavItem
              icon={<FiCalendar size={15} />}
              label="Booking Requests"
              badge="5"
              badgeClass="warning"
              active={activeNav === "Booking Requests"}
              onClick={() => { setActiveNav("Booking Requests"); navigate("/Booking-Requests"); }}
            />
            <NavItem
              icon={<FiCheckCircle size={15} />}
              label="Confirmed Bookings"
              badge="8"
              badgeClass="success"
              active={activeNav === "Confirmed Bookings"}
              onClick={() => { setActiveNav("Confirmed Bookings"); navigate("/Confirmed-bookings"); }}
            />
            <NavItem
              icon={<FiCalendar size={15} />}
              label="Scheduled Visits"
              badge="3"
              active={activeNav === "Scheduled Visits"}
              onClick={() => { setActiveNav("Scheduled Visits"); navigate("/Scheduled-visits"); }}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">PAYMENTS</span>
            <NavItem
              icon={<FiDollarSign size={15} />}
              label="Payment History"
              active={activeNav === "Payment History"}
              onClick={() => setActiveNav("Payment History")}
            />
            <NavItem
              icon={<FiCreditCard size={15} />}
              label="Rent Collection"
              active={activeNav === "Rent Collection"}
              onClick={() => { setActiveNav("Rent Collection"); navigate("/rent-collection"); }}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">ACCOUNT</span>
            <NavItem
              icon={<FiUser size={15} />}
              label="My Profile"
              active={activeNav === "My Profile"}
              onClick={() => setActiveNav("My Profile")}
            />
            <NavItem
              icon={<FiShield size={15} />}
              label="Verification"
              active={activeNav === "Verification"}
              onClick={() => setActiveNav("Verification")}
            />
            <NavItem
              icon={<FiSettings size={15} />}
              label="Settings"
              active={activeNav === "Settings"}
              onClick={() => setActiveNav("Settings")}
            />
          </div>

        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout">
            <FiLogOut size={15} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">

        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
              <FiMenu size={24} />
            </button>
            <div className="search-box">
              <FiSearch size={20} />
              <input type="text" placeholder="Search listings, bookings, messages..." />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn notification-btn">
              <FiBell size={20} />
              <span className="notification-dot" />
            </button>
            <button className="header-btn message-btn" onClick={goToMessages}>
              <FiMessageSquare size={20} />
              <span className="message-count">7</span>
            </button>
            <div className="landlord-profile">
              <div className="landlord-avatar">
                <FiUser size={24} />
              </div>
              <div className="landlord-info">
                <span className="landlord-name">Sita Thapa</span>
                <span className="landlord-status verified">
                  <FiCheckCircle size={12} />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>My Listings</h1>
              <p>Manage all your property listings</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-primary" onClick={() => navigate("/add-property")}>
                <FiPlus size={16} />
                Add New Listing
              </button>
            </div>
          </div>

          <div className="listings-grid">
            {listings.map((listing, i) => (
              <div className="listing-card" key={i}>
                <div className="listing-image">
                  <div className="placeholder-image" />
                  <span className={`listing-status ${listing.status}`}>
                    {listing.status === "available" ? "Available" : "Rented"}
                  </span>
                </div>
                <div className="listing-details">
                  <span className="listing-type">{listing.type}</span>
                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-location">
                    <FiMapPin size={14} />
                    {listing.location}
                  </p>
                  <div className="listing-price">
                    {listing.price}<span>/month</span>
                  </div>
                  <div className="listing-actions">
                    <button className="btn btn-sm btn-primary">Edit</button>
                    <button className="btn btn-sm btn-outline">View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
}
export default MyListings;