import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../css/LandlordCss/Landlordglobal.css";
import "../../css/LandlordCss/ConfirmedBooking.css";

import {
  FiHome,
  FiGrid,
  FiPlus,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiBell,
  FiMessageSquare,
  FiEye,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  fetchConfirmedBookings,
  removeConfirmedBooking,
  fetchBookingRequestCount,
} from "../../scripts/LandlordScripts/ConfirmedBookings";

// ── NavItem ─────────────────────────────────────────────
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

// ── MAIN COMPONENT ──────────────────────────────────────
function ConfirmedBookings() {
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("Confirmed Bookings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToRemove, setBookingToRemove] = useState(null);

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchConfirmedBookings();
        setBookings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadRequestCount = async () => {
      try {
        const data = await fetchBookingRequestCount();
        setRequestCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };
    loadRequestCount();
  }, []);

  const handleRemoveClick = (id) => {
    setBookingToRemove(id);
    setShowConfirmModal(true);
  };

  const confirmRemove = async () => {
    if (!bookingToRemove) return;
    try {
      await removeConfirmedBooking(bookingToRemove);
      setBookings((prev) => prev.filter((b) => b.id !== bookingToRemove));
    } catch (err) {
      alert(err.message || "Failed to remove booking");
    } finally {
      setShowConfirmModal(false);
      setBookingToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowConfirmModal(false);
    setBookingToRemove(null);
  };

  const goToMessages = () => navigate("/Messages");

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
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
              onClick={() => {
                setActiveNav("Dashboard");
                navigate("/");
              }}
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
                navigate("/my-listings");
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
              badge={requestCount || undefined}
              badgeClass="warning"
              active={activeNav === "Booking Requests"}
              onClick={() => navigate("/booking-requests")}
            />
            <NavItem
              icon={<FiCheckCircle size={15} />}
              label="Confirmed Bookings"
              badge={bookings.length}
              badgeClass="success"
              active={activeNav === "Confirmed Bookings"}
            />
            <NavItem
              icon={<FiCalendar size={15} />}
              label="Scheduled Visits"
              active={activeNav === "Scheduled Visits"}
              onClick={() => navigate("/scheduled-visits")}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">PAYMENTS</span>
            <NavItem
              icon={<FiDollarSign size={15} />}
              label="Payment History"
              onClick={() => setActiveNav("Payment History")}
            />
            <NavItem
              icon={<FiCreditCard size={15} />}
              label="Rent Collection"
              active={activeNav === "Rent Collection"}
              onClick={() => navigate("/rent-collection")}
            />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">ACCOUNT</span>
            <NavItem
              icon={<FiUser size={15} />}
              label="My Profile"
              onClick={() => setActiveNav("Profile")}
            />
            <NavItem
              icon={<FiSettings size={15} />}
              label="Settings"
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

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu size={24} />
            </button>
            <div className="search-box">
              <FiSearch size={18} />
              <input placeholder="Search confirmed bookings..." />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn">
              <FiBell size={20} />
            </button>
            <button className="header-btn" onClick={goToMessages}>
              <FiMessageSquare size={20} />
            </button>
            <div className="landlord-profile">
              <div className="landlord-avatar">
                <FiUser size={22} />
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
              <p>All accepted tenant bookings</p>
            </div>
          </div>

          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Move-in</th>
                  <th>Rent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6">No confirmed bookings</td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.tenant_name}</td>
                      <td>{b.property}</td>
                      <td>
                        {new Date(b.proposed_move_in).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>Rs. {b.monthly_rent}</td>
                      <td>
                        <span className="status-badge success">
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-outline">
                          <FiEye /> View
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveClick(b.id)}
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL - IN FRONT */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-header">
              <h3>Remove Booking?</h3>
              <button className="modal-close" onClick={cancelRemove}>
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p>Are you sure you want to remove this confirmed booking?</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cancelRemove}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmRemove}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmedBookings;