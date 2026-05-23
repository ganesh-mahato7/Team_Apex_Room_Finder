import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Feedback.css";

function Feedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="logo-text">RoomFinder</span>
        </div>

        <nav className="nav-menu">

          <div className="nav-section">
            <span className="nav-section-title">Main</span>
            <Link to="/" className="nav-item">Dashboard</Link>
            <Link to="/users" className="nav-item">Users</Link>
            <Link to="/landlords" className="nav-item">Landlords</Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Listings</span>
            <Link to="/listings" className="nav-item">All Listings</Link>
            <Link to="/reported" className="nav-item">Reported</Link>
            <Link to="/outdated" className="nav-item">Outdated</Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Management</span>
            <Link to="/payments" className="nav-item">Payments & Commission</Link>
            <Link to="/feedback" className="nav-item active">Feedback & Complaints</Link>
            <Link to="/analytics" className="nav-item">Analytics & Reports</Link>
          </div>

          {/* ✅ ADDED - these were missing before! */}
          <div className="nav-section">
            <span className="nav-section-title">Security</span>
            <Link to="/blocked-users" className="nav-item">Blocked Users</Link>
            <Link to="/settings" className="nav-item">Settings</Link>
          </div>

        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">

        <header className="header">
          <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div className="admin-info">
              <span className="admin-name">Admin User</span>
              <span className="admin-role">Super Admin</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Feedback & Complaints</h1>
              <p>Manage user feedback, complaints, and suggestions</p>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-tabs">
              <button className="filter-tab active">All <span className="count">45</span></button>
              <button className="filter-tab">Complaint <span className="count">8</span></button>
              <button className="filter-tab">Suggestion <span className="count">32</span></button>
              <button className="filter-tab">Bug Report <span className="count">5</span></button>
              <button className="filter-tab">Pending <span className="count">12</span></button>
              <button className="filter-tab">Resolved <span className="count">33</span></button>
            </div>
          </div>

          <div className="feedback-container">

            <div className="feedback-item pending">
              <div className="feedback-header">
                <div className="feedback-meta">
                  <div className="user-avatar">BG</div>
                  <div className="feedback-info">
                    <span className="feedback-user">Binod Gurung</span>
                    <span className="feedback-email">binod@email.com</span>
                  </div>
                </div>
                <div className="feedback-status">
                  <span className="feedback-type complaint">Complaint</span>
                  <span className="feedback-date">May 4, 2026</span>
                </div>
              </div>
              <div className="feedback-content">
                <h4>Landlord did not show up</h4>
                <p>I had scheduled visit but landlord did not come.</p>
              </div>
              <div className="feedback-actions">
                <button className="btn btn-sm btn-primary">Resolve</button>
                <button className="btn btn-sm btn-outline">Message</button>
                <button className="btn btn-sm btn-danger">Escalate</button>
              </div>
            </div>

            <div className="feedback-item resolved">
              <div className="feedback-header">
                <div className="feedback-meta">
                  <div className="user-avatar">MK</div>
                  <div className="feedback-info">
                    <span className="feedback-user">Maya KC</span>
                    <span className="feedback-email">maya@email.com</span>
                  </div>
                </div>
                <div className="feedback-status">
                  <span className="feedback-type suggestion">Suggestion</span>
                  <span className="feedback-date">May 3, 2026</span>
                </div>
              </div>
              <div className="feedback-content">
                <h4>Virtual tour feature</h4>
                <p>Please add 360° room viewing.</p>
              </div>
              <div className="feedback-actions">
                <button className="btn btn-sm btn-outline">Reopen</button>
                <button className="btn btn-sm btn-outline">Message</button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Feedback;