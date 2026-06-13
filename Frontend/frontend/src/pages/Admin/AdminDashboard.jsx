import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/adminstyles.css';
import '../../css/AdminCss/Sidebar.css';
import { FiMenu, FiSearch, FiBell, FiHome } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { fetchDashboardStats, fetchRecentUsers, getInitials, getRoleLabel, getRoleClass } from '../../scripts/AdminScripts/AdminDashboard.js';

function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats,        setStats]        = useState({
    totalUsers: 0, totalLandlords: 0, totalTenants: 0, totalListings: 0, totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [logo,        setLogo]        = useState(localStorage.getItem('adminLogo') || null);

  useEffect(() => {
    fetchDashboardStats(setStats, setLoading);
    fetchRecentUsers(setRecentUsers);

    // Listen for logo changes
    const handleLogoChange = () => setLogo(localStorage.getItem('adminLogo'));
    window.addEventListener('logo-updated', handleLogoChange);
    return () => window.removeEventListener('logo-updated', handleLogoChange);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu size={24} />
            </button>
            <div className="search-box">
              <FiSearch size={20} />
              <input type="text" placeholder="Search users, listings, reports..." />
            </div>
          </div>
          <div className="header-right">
            {/* Go to Home */}
            <button className="header-btn" title="Go to Home" onClick={() => navigate('/')}>
              <FiHome size={20} />
            </button>
            <button className="header-btn">
              <FiBell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">
                {logo
                  ? <img src={logo} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }} />
                  : <FaUserCircle size={24} />
                }
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
              <button className="btn btn-outline">Export Report</button>
              <button className="btn btn-primary">Send Announcement</button>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="stats-grid">
            {[
              { label: 'Total Users',      value: stats.totalUsers,    cls: 'users' },
              { label: 'Landlords',        value: stats.totalLandlords, cls: 'landlords' },
              { label: 'Total Listings',   value: stats.totalListings,  cls: 'listings' },
              { label: 'Commission Earned',value: `Rs. ${Number(stats.totalRevenue).toLocaleString()}`, cls: 'revenue', raw: true },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <div className={`stat-icon ${s.cls}`} />
                <div className="stat-info">
                  <span className="stat-value">
                    {loading ? '...' : s.raw ? s.value : s.value.toLocaleString()}
                  </span>
                  <span className="stat-label">{s.label}</span>
                </div>
              </div>
            ))}
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
                <Link to="/admin/users" className="view-all">View All</Link>
              </div>
              <div className="card-content">
                {recentUsers.length === 0 ? (
                  <div className="no-data">No users yet.</div>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Reported Listings</h3>
                <Link to="/admin/reported" className="view-all">View All</Link>
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