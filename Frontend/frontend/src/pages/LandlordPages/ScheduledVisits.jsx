import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/LandlordCss/Landlordglobal.css";
import "../../css/LandlordCss/ScheduledVisit.css";

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
} from "react-icons/fi";

// ── Data ─────────────────────────────────────────────────────────────────────

const visits = [
  {
    day: "18",
    month: "May",
    time: "2:30 PM - 3:00 PM",
    guest: "Anuj Poudel",
    property: "2BHK Apartment, Kathmandu",
  },
  {
    day: "20",
    month: "May",
    time: "10:00 AM - 10:30 AM",
    guest: "Sunita Rana",
    property: "3BHK Flat, Bhaktapur",
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

function ScheduledVisits() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Scheduled Visits");
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
              onClick={() => { setActiveNav("Dashboard"); navigate("/landlord-dashboard"); }}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">LISTINGS</span>
            <NavItem
              icon={<FiHome size={15} />}
              label="My Listings"
              badge="12"
              active={activeNav === "My Listings"}
              onClick={() => { setActiveNav("My Listings"); navigate("/my-listings"); }}
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
              onClick={() => setActiveNav("Scheduled Visits")}
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
              <input type="text" placeholder="Search visits..." />
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
              <h1>Scheduled Visits</h1>
              <p>Manage property visits and showings</p>
            </div>
          </div>

          <div className="visits-list">
            {visits.map((visit, i) => (
              <div className="visit-item" key={i}>
                <div className="visit-date-box">
                  <div className="visit-day">{visit.day}</div>
                  <div className="visit-month">{visit.month}</div>
                </div>
                <div className="visit-content">
                  <div className="visit-time">{visit.time}</div>
                  <h3 className="visit-guest">{visit.guest}</h3>
                  <p className="visit-property">{visit.property}</p>
                </div>
                <div className="visit-actions">
                  <button className="btn btn-sm btn-success">Confirm</button>
                  <button className="btn btn-sm btn-outline">Reschedule</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
}
export default ScheduledVisits;