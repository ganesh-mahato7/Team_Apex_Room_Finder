import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Payments.css';

function Payments() {
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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="logo-text">RoomFinder</span>
        </div>

        <nav className="nav-menu">

          <div className="nav-section">
            <span className="nav-section-title">Main</span>

            <Link to="/" className="nav-item">
              Dashboard
            </Link>

            <Link to="/users" className="nav-item">
              Users
              <span className="badge">245</span>
            </Link>

            <Link to="/landlords" className="nav-item">
              Landlords
              <span className="badge">89</span>
            </Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Listings</span>

            <Link to="/listings" className="nav-item">
              All Listings
              <span className="badge">512</span>
            </Link>

            <Link to="/reported" className="nav-item">
              Reported
              <span className="badge warning">23</span>
            </Link>

            <Link to="/outdated" className="nav-item">
              Outdated
              <span className="badge">15</span>
            </Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Management</span>

            <Link to="/payments" className="nav-item active">
              Payments & Commission
            </Link>

            <Link to="/feedback" className="nav-item">
              Feedback & Complaints
              <span className="badge warning">8</span>
            </Link>

            <Link to="/analytics" className="nav-item">
              Analytics & Reports
            </Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Security</span>

            <Link to="/blocked" className="nav-item">
              Blocked Users
              <span className="badge danger">12</span>
            </Link>

            <Link to="/settings" className="nav-item">
              Settings
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <a href="#" className="nav-item logout">
            Logout
          </a>
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
            <button className="header-btn notification-btn">
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">A</div>

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
              <h1>Payments & Commission</h1>
              <p>Manage transactions and commission tracking</p>
            </div>

            <div className="header-actions">
              <button className="btn btn-outline">
                Export Report
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">Rs. 1.2M</span>
                <span className="stat-label">Total Commission</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">Rs. 85,000</span>
                <span className="stat-label">This Month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">856</span>
                <span className="stat-label">Transactions</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">98.5%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>

          </div>

          {/* Filter */}
          <div className="filter-section">
            <h3>Commission Tracking</h3>

            <div className="filter-tabs">
              <button className="filter-tab active">
                All Transactions
              </button>

              <button className="filter-tab">
                Completed
              </button>

              <button className="filter-tab">
                Pending
              </button>

              <button className="filter-tab">
                Failed
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="card">

            <div className="card-header">
              <h3>Transaction History</h3>
              <a href="#" className="view-all">
                Download CSV
              </a>
            </div>

            <div className="card-content">

              <table className="data-table">

                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Landlord</th>
                    <th>Amount</th>
                    <th>Commission</th>
                    <th>Platform Fees</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>#TXN-78452</td>
                    <td>Ram Sharma</td>
                    <td>Sita Thapa</td>
                    <td>Rs. 15,000</td>
                    <td className="commission">Rs. 750</td>
                    <td>Rs. 150</td>
                    <td>May 4, 2026</td>
                    <td>
                      <span className="status-badge success">
                        Completed
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>#TXN-78450</td>
                    <td>Binod Gurung</td>
                    <td>Krishna Rai</td>
                    <td>Rs. 18,000</td>
                    <td className="commission">Rs. 900</td>
                    <td>Rs. 180</td>
                    <td>May 2, 2026</td>
                    <td>
                      <span className="status-badge pending">
                        Pending
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>#TXN-78448</td>
                    <td>Sunita Basnet</td>
                    <td>Ramesh Khanal</td>
                    <td>Rs. 20,000</td>
                    <td className="commission">Rs. 1,000</td>
                    <td>Rs. 200</td>
                    <td>Apr 28, 2026</td>
                    <td>
                      <span className="status-badge failed">
                        Failed
                      </span>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Payments;