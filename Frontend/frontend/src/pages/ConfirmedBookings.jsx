import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Landlordglobal.css";
import "../css/ConfirmedBooking.css";

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

const confirmedBookings = [
  {
    initials: "AK",
    name: "Ajit Kumar",
    property: "2BHK Apartment, Kathmandu",
    moveIn: "June 1, 2026",
    rent: "Rs. 15,000",
    status: "Active",
  },
  {
    initials: "NK",
    name: "Nisha Karki",
    property: "3BHK Flat, Bhaktapur",
    moveIn: "June 15, 2026",
    rent: "Rs. 22,000",
    status: "Active",
  },
  {
    initials: "RK",
    name: "Rajesh Koirala",
    property: "Single Room, Lalitpur",
    moveIn: "May 15, 2026",
    rent: "Rs. 8,000",
    status: "Active",
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

function ConfirmedBookings() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Confirmed Bookings");
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
              onClick={() => { setActiveNav("Booking Requests"); navigate("/booking-requests"); }}
            />
            <NavItem
              icon={<FiCheckCircle size={15} />}
              label="Confirmed Bookings"
              badge="8"
              badgeClass="success"
              active={activeNav === "Confirmed Bookings"}
              onClick={() =>   setActiveNav("Confirmed Bookings")}
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
              <input type="text" placeholder="Search bookings..." />
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
              <h1>Confirmed Bookings</h1>
              <p>Your confirmed tenant bookings</p>
            </div>
          </div>

          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Property</th>
                  <th>Move-in Date</th>
                  <th>Monthly Rent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedBookings.map((booking, i) => (
                  <tr key={i}>
                    <td>
                      <div className="tenant-cell">
                        <div className="tenant-avatar">{booking.initials}</div>
                        <span>{booking.name}</span>
                      </div>
                    </td>
                    <td>{booking.property}</td>
                    <td>{booking.moveIn}</td>
                    <td>{booking.rent}</td>
                    <td>
                      <span className="status-badge success">{booking.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

    </div>
  );
}
export default ConfirmedBookings;