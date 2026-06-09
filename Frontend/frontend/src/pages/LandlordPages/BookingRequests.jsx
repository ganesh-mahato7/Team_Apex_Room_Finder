import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/LandlordCss/Landlordglobal.css";
import "../../css/LandlordCss/BookingRequest.css";

import {
  FiHome, FiGrid, FiPlus, FiCalendar, FiCheckCircle,
  FiDollarSign, FiCreditCard, FiUser,
  // FiShield,
  FiSettings, FiLogOut, FiMenu, FiSearch, FiBell,
  FiMessageSquare, FiClock, FiMapPin, FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import {
  fetchBookingRequests,
  acceptBookingRequest,
  rejectBookingRequest,
  fetchConfirmedCount,
  getInitials,
  formatDate,
  formatMoveIn,
  formatCurrency,
} from "../../scripts/LandlordScripts/BookingRequest.js";

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

// ── Skeleton Loader ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="booking-request-item skeleton-card" aria-hidden="true">
      <div className="booking-header">
        <div className="user-info">
          <div className="skeleton skeleton-avatar" />
          <div className="user-details">
            <div className="skeleton skeleton-line skeleton-name" />
            <div className="skeleton skeleton-line skeleton-sub" />
          </div>
        </div>
        <div className="skeleton skeleton-line skeleton-date" />
      </div>
      <div className="booking-body">
        <div className="skeleton skeleton-line skeleton-msg" />
        <div className="skeleton skeleton-line skeleton-msg-short" />
        <div className="booking-details-skeleton">
          <div className="skeleton skeleton-line skeleton-chip" />
          <div className="skeleton skeleton-line skeleton-chip" />
        </div>
      </div>
      <div className="booking-actions">
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FiCalendar size={40} />
      </div>
      <h3>No Pending Requests</h3>
      <p>All booking requests have been handled. New requests will appear here.</p>
    </div>
  );
}

// ── Toast Notification ────────────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function BookingRequests() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Booking Requests");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // which card is being acted on
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmedCount, setConfirmedCount] = useState(0);

  // ── Toast helper ─────────────────────────────────────────────────────────

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Fetch data ────────────────────────────────────────────────────────────

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBookingRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => {
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchBookingRequests();
      setRequests(data || []);
    } catch (err) {
      setError(err.message || "Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  };

  loadRequests();
}, []);



useEffect(() => {
  const loadConfirmedCount = async () => {
    try {
      const data = await fetchConfirmedCount();

      setConfirmedCount(data.count);
    } catch (err) {
      console.error("Failed to fetch confirmed count:", err);
    }
  };

  loadConfirmedCount();
}, []);

  // ── Accept ────────────────────────────────────────────────────────────────
const handleAccept = async (req) => {
  if (processingId) return;

  setProcessingId(req.id);

  try {
    await acceptBookingRequest(req.id);

    // remove pending request
    setRequests((prev) => prev.filter((r) => r.id !== req.id));

    // increase confirmed booking count
    setConfirmedCount((prev) => prev + 1);

    addToast(
      `${req.tenant_name}'s booking accepted and moved to Confirmed Bookings.`,
      "success"
    );
  } catch (err) {
    addToast(err.message || "Failed to accept request.", "error");
  } finally {
    setProcessingId(null);
  }
};

  // ── Reject ────────────────────────────────────────────────────────────────

  const handleReject = async (req) => {
  if (processingId) return;

  const confirmed = window.confirm(
    `Reject booking request from ${req.tenant_name}?`
  );

  if (!confirmed) return;

  setProcessingId(req.id);

  try {
    await rejectBookingRequest(req.id);

    setRequests((prev) => prev.filter((r) => r.id !== req.id));

    addToast(
      `${req.tenant_name}'s request has been rejected and removed.`,
      "error"
    );
  } catch (err) {
    addToast(err.message || "Failed to reject request.", "error");
  } finally {
    setProcessingId(null);
  }
};

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filtered = requests.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.tenant_name?.toLowerCase().includes(q) ||
      r.property?.toLowerCase().includes(q)
    );
  });

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="dashboard-container">
      <Toast toasts={toasts} />

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="logo">
          <div className="logo-icon"><FiHome size={22} /></div>
          <span className="logo-text">RoomFinder</span>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">
            <span className="nav-section-title">MAIN</span>
            <NavItem icon={<FiGrid size={15} />} label="Dashboard"
              active={activeNav === "Dashboard"}
              onClick={() => { setActiveNav("Dashboard"); navigate("/"); }} />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">LISTINGS</span>
            <NavItem icon={<FiHome size={15} />} label="My Listings" badge="12"
              active={activeNav === "My Listings"}
              onClick={() => { setActiveNav("My Listings"); navigate("/My-listings"); }} />
            <NavItem icon={<FiPlus size={15} />} label="Add New Listing"
              active={activeNav === "Add New Listing"}
              onClick={() => { setActiveNav("Add New Listing"); navigate("/add-property"); }} />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">BOOKINGS</span>
            <NavItem icon={<FiCalendar size={15} />} label="Booking Requests"
              badge={requests.length || undefined}
              badgeClass="warning"
              active={activeNav === "Booking Requests"}
              onClick={() => { setActiveNav("Booking Requests"); navigate("/Booking-Requests"); }} />


            <NavItem icon={<FiCheckCircle size={15} />} label="Confirmed Bookings"badge={confirmedCount || undefined} badgeClass="success"
            active={activeNav === "Confirmed Bookings"}
            onClick={() => {
            setActiveNav("Confirmed Bookings");
            navigate("/Confirmed-bookings");
          }} /> 
        



              
            <NavItem icon={<FiCalendar size={15} />} label="Scheduled Visits"
              badge="3"
              active={activeNav === "Scheduled Visits"}
              onClick={() => { setActiveNav("Scheduled Visits"); navigate("/Scheduled-visits"); }} />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">PAYMENTS</span>
            <NavItem icon={<FiDollarSign size={15} />} label="Payment History"
              active={activeNav === "Payment History"}
              onClick={() => setActiveNav("Payment History")} />
            <NavItem icon={<FiCreditCard size={15} />} label="Rent Collection"
              active={activeNav === "Rent Collection"}
              onClick={() => { setActiveNav("Rent Collection"); navigate("/Rent-collection"); }} />
          </div>

          <div className="nav-section">
            <span className="nav-section-title">ACCOUNT</span>
            <NavItem icon={<FiUser size={15} />} label="My Profile"
              active={activeNav === "My Profile"} onClick={() => setActiveNav("My Profile")} />
            {/* <NavItem icon={<FiShield size={15} />} label="Verification"
              active={activeNav === "Verification"} onClick={() => setActiveNav("Verification")} /> */}
            <NavItem icon={<FiSettings size={15} />} label="Settings"
              active={activeNav === "Settings"} onClick={() => setActiveNav("Settings")} />
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout">
            <FiLogOut size={15} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">

        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen((p) => !p)}>
              <FiMenu size={24} />
            </button>
            <div className="search-box">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Search by name or property…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn notification-btn">
              <FiBell size={20} /><span className="notification-dot" />
            </button>
            <button className="header-btn message-btn" onClick={() => navigate("/Messages")}>
              <FiMessageSquare size={20} /><span className="message-count">7</span>
            </button>
            <div className="landlord-profile">
              <div className="landlord-avatar"><FiUser size={24} /></div>
              <div className="landlord-info">
                <span className="landlord-name">Sita Thapa</span>
                <span className="landlord-status verified">
                  <FiCheckCircle size={12} />Verified
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          {/* ── Page Header ── */}
          <div className="page-header">
            <div className="page-title">
              <h1>Booking Requests</h1>
              <p>Review and manage incoming tenant booking requests</p>
            </div>

            <div className="page-header-actions">
              {!loading && (
                <span className="request-count-badge">
                  {filtered.length} pending {filtered.length === 1 ? "request" : "requests"}
                </span>
              )}
              <button
                className="btn-refresh"
                onClick={loadRequests}
                disabled={loading}
                title="Refresh"
              >
                <FiRefreshCw size={15} className={loading ? "spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {/* ── Error State ── */}
          {error && (
            <div className="error-banner">
              <FiAlertCircle size={18} />
              <span>{error}</span>
              <button onClick={loadRequests} className="retry-btn">Retry</button>
            </div>
          )}

          {/* ── Cards ── */}
          <div className="bookings-list">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((req) => {
                const initials = req.initials || getInitials(req.tenant_name);
                const isProcessing = processingId === req.id;

                return (
                  <div
                    className={`booking-request-item${isProcessing ? " processing" : ""}`}
                    key={req.id}
                  >
                    {/* Header */}
                    <div className="booking-header">
                      <div className="user-info">
                        <div className="user-avatar" aria-hidden="true">{initials}</div>
                        <div className="user-details">
                          <h3 className="user-name">{req.tenant_name}</h3>
                          <p className="property-name">
                            <FiMapPin size={12} />
                            {req.property}
                          </p>
                        </div>
                      </div>
                      <div className="booking-meta">
                        <span className="status-pill pending">
                          <FiClock size={11} /> Pending
                        </span>
                        <span className="booking-date">{formatDate(req.request_date)}</span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="booking-body">
                      <p className="booking-msg">{req.message}</p>
                    </div>

                    {/* Details row */}
                    <div className="booking-details">
                      <div className="detail-chip">
                        <span className="detail-label">Token Amount</span>
                        <span className="detail-value">{formatCurrency(req.token_amount)}</span>
                      </div>
                      <div className="detail-chip">
                        <span className="detail-label">Move-in</span>
                        <span className="detail-value">{formatMoveIn(req.proposed_move_in)}</span>
                      </div>
                      <div className="detail-chip">
                        <span className="detail-label">Monthly Rent</span>
                        <span className="detail-value highlight">{formatCurrency(req.monthly_rent)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="booking-actions">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleAccept(req)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing…" : "Accept"}
                      </button>
                      <button
                        className="btn btn-sm btn-reject"
                        onClick={() => handleReject(req)}
                        disabled={isProcessing}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default BookingRequests;