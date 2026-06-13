import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/LandlordCss/Landlordglobal.css";
import "../../css/LandlordCss/Message.css";

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
  FiBell,
  FiMessageSquare,
} from "react-icons/fi";

// ── Data ─────────────────────────────────────────────────────────────────────

const messages = [
  {
    initials: "AK",
    sender: "Ajit Kumar",
    time: "2 hours ago",
    preview: "Hi, is the 2BHK apartment still available? I'm very interested...",
    property: "2BHK Apartment, Kathmandu",
    unread: true,
  },
  {
    initials: "NK",
    sender: "Nisha Karki",
    time: "4 hours ago",
    preview: "Thank you for accepting my booking request. Can we schedule...",
    property: "3BHK Flat, Bhaktapur",
    unread: true,
  },
  {
    initials: "RK",
    sender: "Rajesh Koirala",
    time: "Yesterday",
    preview: "I have completed the rent payment for May. Thank you for...",
    property: "Single Room, Lalitpur",
    unread: false,
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

function Messages() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Messages");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          </div>

          <div className="header-right">
            <button className="header-btn notification-btn">
              <FiBell size={20} />
              <span className="notification-dot" />
            </button>
            <button className="header-btn message-btn">
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
              <h1>Messages</h1>
              <p>Communicate with tenants and inquiries</p>
            </div>
          </div>

          <div className="messages-list">
            {messages.map((msg, i) => (
              <div className={`message-item${msg.unread ? " unread" : ""}`} key={i}>
                <div className="message-avatar">{msg.initials}</div>
                <div className="message-info">
                  <div className="message-header">
                    <h4 className="message-sender">{msg.sender}</h4>
                    <span className="message-time">{msg.time}</span>
                  </div>
                  <p className="message-preview">{msg.preview}</p>
                  <p className="message-property">{msg.property}</p>
                </div>
                {msg.unread && <div className="message-unread-dot" />}
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
}
export default Messages;