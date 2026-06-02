import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const fetchStats = (setStats) => {
  fetch('http://localhost:5000/api/v1/admin/sidebar-stats')
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(err => console.error('Sidebar stats error:', err));
};

function Sidebar({ open }) {

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const customLogo = localStorage.getItem('adminLogo');

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    reportedListings: 0,
    outdatedListings: 0,
    pendingFeedback: 0,
    blockedUsers: 0,
  });

  useEffect(() => {
    fetchStats(setStats);

    const handler = () => fetchStats(setStats);

    window.addEventListener('sidebar-refresh', handler);

    return () => window.removeEventListener('sidebar-refresh', handler);

  }, []);

  return (

    <aside className={`sidebar ${open ? 'open' : ''}`}>

      <div className="logo">

        <div className="logo-icon">

          {customLogo ? (

            <img
              src={customLogo}
              alt="Logo"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                borderRadius: '6px'
              }}
            />

          ) : (

            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2">

              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>

              <polyline points="9 22 9 12 15 12 15 22"></polyline>

            </svg>

          )}

        </div>

        <span className="logo-text">RoomFinder</span>

      </div>

      <nav className="nav-menu">

        <div className="nav-section">

          <span className="nav-section-title">Main</span>

          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Dashboard
          </Link>

          <Link to="/users" className={`nav-item ${isActive('/users') ? 'active' : ''}`}>
            Users {stats.totalUsers > 0 && <span className="badge">{stats.totalUsers}</span>}
          </Link>

        </div>

        <div className="nav-section">

          <span className="nav-section-title">Listings</span>

          <Link to="/listings" className={`nav-item ${isActive('/listings') ? 'active' : ''}`}>
            All Listings {stats.totalListings > 0 && <span className="badge">{stats.totalListings}</span>}
          </Link>

          <Link to="/reported" className={`nav-item ${isActive('/reported') ? 'active' : ''}`}>
            Reported {stats.reportedListings > 0 && <span className="badge warning">{stats.reportedListings}</span>}
          </Link>

          <Link to="/outdated" className={`nav-item ${isActive('/outdated') ? 'active' : ''}`}>
            Outdated {stats.outdatedListings > 0 && <span className="badge">{stats.outdatedListings}</span>}
          </Link>

        </div>

        <div className="nav-section">

          <span className="nav-section-title">Management</span>

          <Link to="/payments" className={`nav-item ${isActive('/payments') ? 'active' : ''}`}>
            Payments & Commission
          </Link>

          <Link to="/feedback" className={`nav-item ${isActive('/feedback') ? 'active' : ''}`}>
            Feedback {stats.pendingFeedback > 0 && <span className="badge warning">{stats.pendingFeedback}</span>}
          </Link>

          <Link to="/analytics" className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}>
            Analytics & Reports
          </Link>

        </div>

        <div className="nav-section">

          <span className="nav-section-title">Security</span>

          <Link to="/blocked-users" className={`nav-item ${isActive('/blocked-users') ? 'active' : ''}`}>
            Blocked Users {stats.blockedUsers > 0 && <span className="badge danger">{stats.blockedUsers}</span>}
          </Link>

          <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
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

  );

}

export default Sidebar;