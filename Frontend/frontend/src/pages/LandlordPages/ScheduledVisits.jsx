// ScheduledVisits.jsx — purely presentational, no business logic here.
// All state, API calls, and data-transform logic live in:
//   hooks/useScheduledVisits.js
//   services/scheduledVisitsService.js

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
  FiX,
} from "react-icons/fi";

import { useScheduledVisits, TABS } from "../../scripts/LandlordScripts/ScheduledVisits.js";

// ── NavItem ───────────────────────────────────────────────────────────────────
function NavItem({ icon, label, badge, badgeClass = "", active, onClick }) {
  return (
    <button className={`nav-item${active ? " active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge !== 0 && badge !== "" && (
        <span className={`badge${badgeClass ? ` ${badgeClass}` : ""}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── RescheduleModal ───────────────────────────────────────────────────────────
function RescheduleModal({ visit, onClose, onSave }) {
  const [date, setDate] = useState(
    visit.visit_date ? visit.visit_date.slice(0, 10) : ""
  );
  const [time, setTime] = useState(visit.visit_time || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!date || !time) {
      setError("Both date and time are required.");
      return;
    }
    setSaving(true);
    setError("");
    const result = await onSave(visit.id, date, time);
    if (result && !result.success) {
      setError(result.message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Reschedule Visit</h3>
          <button className="modal-close" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-guest">
            <strong>{visit.guest_name}</strong> — {visit.property}
          </p>
          <label>
            New Date
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            New Time{" "}
            <span className="hint">(e.g. 2:30 PM - 3:00 PM)</span>
            <input
              type="text"
              value={time}
              placeholder="2:30 PM - 3:00 PM"
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          {error && <p className="modal-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-sm btn-outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── VisitCard ─────────────────────────────────────────────────────────────────
function VisitCard({ visit, activeTab, onStatusChange, onReschedule, getDay, getMonth }) {
  return (
    <div className="visit-item">
      <div className="visit-date-box">
        <div className="visit-day">{getDay(visit.visit_date)}</div>
        <div className="visit-month">{getMonth(visit.visit_date)}</div>
      </div>

      <div className="visit-content">
        <div className="visit-time">{visit.visit_time}</div>
        <h3 className="visit-guest">{visit.guest_name}</h3>
        <p className="visit-property">{visit.property}</p>
      </div>

      <div className="visit-actions">
        {activeTab === "Pending" && (
          <>
            <button
              className="btn btn-sm btn-success"
              onClick={() => onStatusChange(visit.id, "accepted")}
            >
              Confirm
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onStatusChange(visit.id, "rejected")}
            >
              Reject
            </button>
          </>
        )}

        {activeTab === "Accepted" && (
          <>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onReschedule(visit)}
            >
              Reschedule
            </button>
            <button
              className="btn btn-sm btn-success"
              onClick={() => onStatusChange(visit.id, "completed")}
            >
              Completed
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onStatusChange(visit.id, "cancelled")}
            >
              Cancel
            </button>
          </>
        )}

        {["Rejected", "Completed", "Cancelled"].includes(activeTab) && (
          <span className={`status-badge status-${activeTab.toLowerCase()}`}>
            {activeTab}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function ScheduledVisits() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Scheduled Visits");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    visits,
    loading,
    error,
    activeTab,
    rescheduleTarget,
    setActiveTab,
    handleStatusChange,
    openReschedule,
    closeReschedule,
    handleRescheduleSave,
    tabCount,
    getDay,
    getMonth,
  } = useScheduledVisits();

  const goToMessages = () => navigate("/Messages");

  // ── Visit list for current tab ────────────────────────────────────────────
  const currentList = visits[activeTab.toLowerCase()] || [];

  const renderContent = () => {
    if (loading) return <div className="visits-empty">Loading visits…</div>;
    if (error)   return <div className="visits-empty visits-error">⚠ {error}</div>;
    if (currentList.length === 0)
      return (
        <div className="visits-empty">
          No {activeTab.toLowerCase()} visits.
        </div>
      );

    return currentList.map((visit) => (
      <VisitCard
        key={visit.id}
        visit={visit}
        activeTab={activeTab}
        onStatusChange={handleStatusChange}
        onReschedule={openReschedule}
        getDay={getDay}
        getMonth={getMonth}
      />
    ));
  };

  return (
    <div className="dashboard-container">

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="logo">
          <div className="logo-icon"><FiHome size={22} /></div>
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
              badge={tabCount("Pending")}
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
            <NavItem icon={<FiUser size={15} />}    label="My Profile"   active={activeNav === "My Profile"}   onClick={() => setActiveNav("My Profile")} />
            <NavItem icon={<FiShield size={15} />}  label="Verification" active={activeNav === "Verification"} onClick={() => setActiveNav("Verification")} />
            <NavItem icon={<FiSettings size={15} />} label="Settings"    active={activeNav === "Settings"}     onClick={() => setActiveNav("Settings")} />
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
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
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
              <div className="landlord-avatar"><FiUser size={24} /></div>
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

          {/* ── Status Tabs ── */}
          <div className="visits-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`visits-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tabCount(tab) > 0 && (
                  <span className={`tab-count tab-count-${tab.toLowerCase()}`}>
                    {tabCount(tab)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Visit Cards ── */}
          <div className="visits-list">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* ── Reschedule Modal ── */}
      {rescheduleTarget && (
        <RescheduleModal
          visit={rescheduleTarget}
          onClose={closeReschedule}
          onSave={handleRescheduleSave}
        />
      )}
    </div>
  );
}

export default ScheduledVisits;