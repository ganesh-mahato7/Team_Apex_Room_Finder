import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Landlordglobal.css";
import "../css/RentCollection.css";

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

const tenants = [
  {
    initials: "RK",
    name: "Rajesh Koirala",
    property: "Single Room, Lalitpur",
    monthlyRent: "Rs. 8,000",
    dueDate: "May 5, 2026",
    status: "Paid",
    amount: "Rs. 8,000",
    rowClass: "completed",
    badgeClass: "completed",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    property: "2BHK Apartment, Kathmandu",
    monthlyRent: "Rs. 15,000",
    dueDate: "May 5, 2026",
    status: "Paid",
    amount: "Rs. 15,000",
    rowClass: "completed",
    badgeClass: "completed",
  },
  {
    initials: "AP",
    name: "Anuj Poudel",
    property: "3BHK Flat, Bhaktapur",
    monthlyRent: "Rs. 22,000",
    dueDate: "May 5, 2026",
    status: "Pending",
    amount: "Rs. 0",
    rowClass: "pending",
    badgeClass: "pending",
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

export default function RentCollection() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Rent Collection");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const goToMessages = () => {
    navigate("/Messages");     // Make sure this matches your route
  };
  return (
    <div className="dashboard-container">

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>

        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">
            <FiHome size={22} />
          </div>
          <span className="logo-text">RoomFinder</span>
        </div>

        {/* Navigation */}
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
              onClick={() => { 
                setActiveNav("My Listings");
                navigate("/My-listings")
              }}
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
              onClick={() => {
                setActiveNav("Booking Requests"); navigate("/Booking-Requests");
              }}
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
              onClick={() => {setActiveNav("Scheduled Visits"); navigate("/Scheduled-Visits");}}
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
              onClick={() => {setActiveNav("Rent Collection");}}
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

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="nav-item logout">
            <FiLogOut size={15} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">

        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
              <FiMenu size={24} />
            </button>
            <div className="search-box">
              <FiSearch size={20} />
              <input type="text" placeholder="Search rent collection..." />
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

        {/* Dashboard Content */}
        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Rent Collection</h1>
              <p>Track and manage tenant rent payments</p>
            </div>
          </div>

          <div className="collection-table-wrapper">
            <table className="collection-table">
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Property</th>
                  <th>Monthly Rent</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant, i) => (
                  <tr className={tenant.rowClass} key={i}>
                    <td>
                      <div className="tenant-cell">
                        <div className="tenant-avatar">{tenant.initials}</div>
                        <span>{tenant.name}</span>
                      </div>
                    </td>
                    <td>{tenant.property}</td>
                    <td>{tenant.monthlyRent}</td>
                    <td>{tenant.dueDate}</td>
                    <td>
                      <span className={`status-badge ${tenant.badgeClass}`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td>{tenant.amount}</td>
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
