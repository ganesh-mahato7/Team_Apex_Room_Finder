import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Analytics.css';

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

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
            <Link to="/users" className="nav-item">Users <span className="badge">245</span></Link>
            <Link to="/landlords" className="nav-item">Landlords <span className="badge">89</span></Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Listings</span>

            <Link to="/listings" className="nav-item">All Listings <span className="badge">512</span></Link>
            <Link to="/reported" className="nav-item">Reported <span className="badge warning">23</span></Link>
            <Link to="/outdated" className="nav-item">Outdated <span className="badge">15</span></Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Management</span>

            <Link to="/payments" className="nav-item">Payments & Commission</Link>
            <Link to="/feedback" className="nav-item">Feedback & Complaints <span className="badge warning">8</span></Link>
            <Link to="/analytics" className="nav-item active">Analytics & Reports</Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Security</span>

            <Link to="/blocked" className="nav-item">Blocked Users <span className="badge danger">12</span></Link>
            <Link to="/settings" className="nav-item">Settings</Link>
          </div>

        </nav>

        <div className="sidebar-footer">
          <a href="#" className="nav-item logout">Logout</a>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        <header className="header">

          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
          </div>

          <div className="header-right">

            <button className="header-btn">
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">👤</div>
              <div className="admin-info">
                <span className="admin-name">Admin User</span>
                <span className="admin-role">Super Admin</span>
              </div>
            </div>

          </div>

        </header>

        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Analytics & Reports</h1>
              <p>Platform statistics and performance reports</p>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-info">
                <span className="stat-value">245</span>
                <span className="stat-label">Total Users</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-info">
                <span className="stat-value">512</span>
                <span className="stat-label">Active Listings</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <span className="stat-value">Rs. 1.2M</span>
                <span className="stat-label">Revenue</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏘️</div>
              <div className="stat-info">
                <span className="stat-value">89</span>
                <span className="stat-label">Landlords</span>
              </div>
            </div>

          </div>

          {/* Charts */}
          <div className="charts-section">
            <h2>Usage Trends</h2>
            <div className="chart-placeholder">📊 Chart would be rendered here</div>
          </div>

          {/* Reports */}
          <div className="reports-section">
            <h2>Recent Reports</h2>

            <div className="report-list">

              <div className="report-item">
                <span className="report-name">Monthly User Growth</span>
                <button className="btn-sm">Download</button>
              </div>

              <div className="report-item">
                <span className="report-name">Listing Performance</span>
                <button className="btn-sm">Download</button>
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Analytics;