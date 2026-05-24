import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/landlordStyle.css";

// Feather Icons
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
  FiEye,
  FiMapPin,
  FiEdit,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";

// Material Design Icons
import { MdBedroomParent, MdApartment, MdOtherHouses } from "react-icons/md";
// import Messages from "./Messages";

// ── Data ──────────────────────────────────────────────────────────────────────

const bookingRequests = [
  { initials: "RS", name: "Ram Sharma",   property: "2BHK Apartment, Kathmandu", date: "May 4, 2026", token: "Rs. 5,000" },
  { initials: "HP", name: "Hari Prasad",  property: "Single Room, Lalitpur",     date: "May 3, 2026", token: "Rs. 2,000" },
  { initials: "BG", name: "Binod Gurung", property: "3BHK Flat, Bhaktapur",      date: "May 2, 2026", token: "Rs. 8,000" },
];

const scheduledVisits = [
  { day: "07", month: "May", time: "10:00 AM - 11:00 AM", user: "Maya KC",       property: "2BHK Apartment, Kathmandu" },
  { day: "08", month: "May", time: "2:00 PM - 3:00 PM",   user: "Krishna Rai",   property: "3BHK Flat, Bhaktapur"      },
  { day: "10", month: "May", time: "4:00 PM - 5:00 PM",   user: "Sunita Basnet", property: "Single Room, Lalitpur"     },
];

const listings = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-05-05%20192201-co82jxaXkDlndHKINimkvX1b8akbcF.png",
    status: "available",
    type: "APARTMENT",
    title: "2BHK Apartment, Kathmandu",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 15,000",
    views: "245 views",
    inquiries: "12 inquiries",
  },
  {
    image: null,
    status: "rented",
    type: "ROOM",
    title: "Single Room, Lalitpur",
    location: "Pulchowk, Lalitpur",
    price: "Rs. 8,000",
    views: "189 views",
    inquiries: "8 inquiries",
  },
  {
    image: null,
    status: "available",
    type: "FLAT",
    title: "3BHK Flat, Bhaktapur",
    location: "Suryabinayak, Bhaktapur",
    price: "Rs. 22,000",
    views: "312 views",
    inquiries: "18 inquiries",
  },
];

const verificationItems = [
  "Email Verified",
  "Phone Verified",
  "ID Document Uploaded",
  "Property Ownership Verified",
];

const filterTabs = [
  { label: "All",       icon: <FiGrid size={20} />,          count: 12 },
  { label: "Room",      icon: <MdBedroomParent size={20} />, count: 5  },
  { label: "Apartment", icon: <MdApartment size={20} />,     count: 4  },
  { label: "Flat",      icon: <MdOtherHouses size={20} />,   count: 3  },
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
function LandlordDashboard() {
  const navigate = useNavigate();                  
  const [activeNav, setActiveNav]       = useState("Dashboard");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen]   = useState(false);


  // Navigation handler
   const goToMessages = () => {
    navigate("/Messages");     // Make sure this matches your route
  };
  const goToAddProperty = () => {
    navigate("/add-property");     // Make sure this matches your route
  };
  const goToBookingRequests = () => {
    navigate("/Booking-Requests");     // Make sure this matches your route
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
              onClick={() => setActiveNav("Dashboard")}
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
            onClick={() => { 
            setActiveNav("Add New Listing"); 
            navigate("/add-property"); 
          }}
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
                setActiveNav("Booking Requests");
                navigate("/Booking-Requests")
              
              }}
            />
            <NavItem
              icon={<FiCheckCircle size={15} />}
              label="Confirmed Bookings"
              badge="8"
              badgeClass="success"
              active={activeNav === "Confirmed Bookings"}
              onClick={() => {setActiveNav("Confirmed Bookings"); navigate("/Confirmed-Bookings")}}
            />
            <NavItem
              icon={<FiCalendar size={15} />}
              label="Scheduled Visits"
              badge="3"
              active={activeNav === "Scheduled Visits"}
              onClick={() => {
                setActiveNav("Scheduled Visits");
                navigate("/Scheduled-Visits");
              }}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">PAYMENTS</span>
            {/* <NavItem
              icon={<FiDollarSign size={15} />}
              label="Payment History"
              active={activeNav === "Payment History"}
              onClick={() => setActiveNav("Payment History")}
            /> */}
            <NavItem
              icon={<FiCreditCard size={15} />}
              label="Rent Collection"
              active={activeNav === "Rent Collection"}
             onClick={() => { 
            setActiveNav("Rent Collection"); 
            navigate("/rent-collection"); 
          }}
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
              <FiMenu size={18} />
            </button>
            <div className="search-box">
              <FiSearch size={20} />
              <input type="text" placeholder="Search listings, bookings, messages..." />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn notification-btn">
              <FiBell size={15} />
              <span className="notification-dot" />
            </button>
            <button className="header-btn message-btn" onClick={goToMessages}>
              <FiMessageSquare size={15} />
              <span className="message-count">7</span>
            </button>
            <div className="landlord-profile">
              <div className="landlord-avatar">
                <FiUser size={20} />
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

          {/* Page Title */}
          <div className="page-header">
            <div className="page-title">
              <h1>Welcome back, Sita!</h1>
              <p>Here is what is happening with your properties today.</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-primary" onClick={goToAddProperty}>
                <FiPlus size={18} />
                Add New Listing
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon listings">
                <FiHome size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">12</span>
                <span className="stat-label">Total Listings</span>
              </div>
              <div className="stat-breakdown">
                <span className="available">8 Available</span>
                <span className="rented">4 Rented</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bookings">
                <FiCalendar size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">5</span>
                <span className="stat-label">Pending Requests</span>
              </div>
              <span className="stat-change warning">Needs Action</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon messages">
                <FiMessageSquare size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">7</span>
                <span className="stat-label">Unread Messages</span>
              </div>
              <span className="stat-change warning">New</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue">
                <FiDollarSign size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">Rs. 85,000</span>
                <span className="stat-label">This Month</span>
              </div>
              <span className="stat-change positive">+15.2%</span>
            </div>
          </div>

          {/* Property Filters */}
          <div className="property-filters">
            <h3>My Properties</h3>
            <div className="filter-tabs">
              {filterTabs.map(({ label, icon, count }) => (
                <button
                  key={label}
                  className={`filter-tab${activeFilter === label ? " active" : ""}`}
                  onClick={() => setActiveFilter(label)}
                >
                  {icon}
                  <span>{label}</span>
                  <span className="count">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Listings Grid */}
          <div className="listings-section">
            <div className="section-header">
              <h3>My Listings</h3>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="listings-grid">
              {listings.map((listing, i) => (
                <div className="listing-card" key={i}>
                  <div className="listing-image">
                    {listing.image
                      ? <img src={listing.image} alt={listing.title} />
                      : <div className="placeholder-image" />
                    }
                    <span className={`listing-status ${listing.status}`}>
                      {listing.status === "available" ? "Available" : "Rented"}
                    </span>
                    <div className="listing-actions-overlay">
                      <button className="overlay-btn edit"   title="Edit">  <FiEdit   size={16} /></button>
                      <button className="overlay-btn delete" title="Delete"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="listing-details">
                    <div className="listing-type">{listing.type}</div>
                    <h4 className="listing-title">{listing.title}</h4>
                    <p className="listing-location">
                      <FiMapPin size={14} />
                      {listing.location}
                    </p>
                    <div className="listing-price">
                      {listing.price}<span>/month</span>
                    </div>
                    <div className="listing-stats">
                      <span><FiEye size={14} /> {listing.views}</span>
                      <span><FiMessageSquare size={14} /> {listing.inquiries}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">

            {/* Booking Requests */}
            <div className="card booking-requests">
              <div className="card-header">
                <h3>Booking Requests</h3>
                <a href="" className="view-all" onClick={goToBookingRequests}>View All</a>
              </div>
              <div className="card-content">
                <div className="booking-list">
                  {bookingRequests.map((req, i) => (
                    <div className="booking-item" key={i}>
                      <div className="booking-user">
                        <div className="user-avatar">{req.initials}</div>
                        <div className="booking-info">
                          <span className="user-name">{req.name}</span>
                          <span className="booking-property">{req.property}</span>
                          <span className="booking-date">Requested: {req.date}</span>
                        </div>
                      </div>
                      <div className="booking-token">
                        <span className="token-label">Token Amount</span>
                        <span className="token-amount">{req.token}</span>
                      </div>
                      <div className="booking-actions">
                        <button className="btn btn-sm btn-success">Accept</button>
                        <button className="btn btn-sm btn-outline">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheduled Visits */}
            <div className="card scheduled-visits">
              <div className="card-header">
                <h3>Scheduled Visits</h3>
                <a href="#" className="view-all">View All</a>
              </div>
              <div className="card-content">
                <div className="visits-list">
                  {scheduledVisits.map((visit, i) => (
                    <div className="visit-item" key={i}>
                      <div className="visit-date">
                        <span className="day">{visit.day}</span>
                        <span className="month">{visit.month}</span>
                      </div>
                      <div className="visit-info">
                        <span className="visit-time">{visit.time}</span>
                        <span className="visit-user">{visit.user}</span>
                        <span className="visit-property">{visit.property}</span>
                      </div>
                      <div className="visit-actions">
                        <button className="action-btn confirm"    title="Confirm">   <FiCheck    size={18} /></button>
                        <button className="action-btn reschedule" title="Reschedule"><FiCalendar size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Verification Section */}
          <div className="card verification-section">
            <div className="card-header">
              <h3>Profile Verification</h3>
            </div>
            <div className="card-content">
              <div className="verification-status">
                <div className="verification-badge verified">
                  <FiShield size={48} />
                  <span>Verified Landlord</span>
                </div>
                <p className="verification-text">
                  Your profile is verified. Verified profiles get more visibility and trust from room seekers.
                </p>
              </div>
              <div className="verification-checklist">
                {verificationItems.map((item) => (
                  <div className="checklist-item completed" key={item}>
                    <FiCheckCircle size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
export default LandlordDashboard;