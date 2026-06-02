import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/adminstyles.css';
import '../../css/AdminCss/Sidebar.css';
import { fetchDashboardStats, fetchRecentUsers, getInitials, getRoleLabel, getRoleClass } from '../../scripts/AdminScripts/AdminDashboard.js';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLandlords: 0,
    totalTenants: 0,
    totalListings: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchDashboardStats(setStats, setLoading);
    fetchRecentUsers(setRecentUsers);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search users, listings, reports..." />
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="notification-dot"></span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="admin-info">
                <span className="admin-name">Admin User</span>
                <span className="admin-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Dashboard Overview</h1>
            <div className="header-actions">
              <button className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export Report
              </button>
              <button className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Send Announcement
              </button>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : stats.totalUsers.toLocaleString()}</span>
                <span className="stat-label">Total Users</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon landlords">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : stats.totalLandlords.toLocaleString()}</span>
                <span className="stat-label">Landlords</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon listings">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : stats.totalListings.toLocaleString()}</span>
                <span className="stat-label">Total Listings</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{loading ? '...' : `Rs. ${Number(stats.totalRevenue).toLocaleString()}`}</span>
                <span className="stat-label">Commission Earned</span>
              </div>
            </div>
          </div>

          {/* PROPERTY FILTERS */}
          <div className="property-filters">
            <h3>Property Types Overview</h3>
            <div className="filter-tabs">
              {['All', 'Room', 'Apartment', 'Flat'].map(f => (
                <button key={f} className={`filter-tab ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                  <span>{f}</span>
                  <span className="count">{f === 'All' ? stats.totalListings : '—'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Recent Users</h3>
                <Link to="/users" className="view-all">View All</Link>
              </div>
              <div className="card-content">
                {recentUsers.length === 0 ? (
                  <div className="no-data">No users yet. Register some users first!</div>
                ) : (
                  <div className="user-list">
                    {recentUsers.map(u => (
                      <div className="user-item" key={u.id}>
                        <div className="user-avatar">{getInitials(u.name)}</div>
                        <div className="user-info">
                          <span className="user-name">{u.name}</span>
                          <span className="user-email">{u.email}</span>
                        </div>
                        <span className={`user-type ${getRoleClass(u.role)}`}>{getRoleLabel(u.role)}</span>
                        <div className="user-actions">
                          <button className="action-btn view">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                          <button className="action-btn block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Reported Listings</h3>
                <Link to="/reported" className="view-all">View All</Link>
              </div>
              <div className="card-content">
                <div className="no-data">No reported listings yet.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;