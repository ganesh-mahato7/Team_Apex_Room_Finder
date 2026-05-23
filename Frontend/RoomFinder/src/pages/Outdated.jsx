import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Outdated.css';

function Outdated() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filters = [
    { label: 'All', count: 15 },
    { label: '1+ Month', count: 8 },
    { label: '3+ Months', count: 5 },
    { label: '6+ Months', count: 2 },
  ];

  const listings = [
    {
      id: 1,
      title: 'Old Listing',
      location: 'Patan, Lalitpur',
      updated: '2 months ago',
      by: 'Krishna Rai',
      category: '1+ Month',
    },
    {
      id: 2,
      title: 'Apartment Listing',
      location: 'Baneshwor, Kathmandu',
      updated: '4 months ago',
      by: 'Ram Sharma',
      category: '3+ Months',
    },
    {
      id: 3,
      title: 'Flat Listing',
      location: 'Bhaktapur',
      updated: '7 months ago',
      by: 'Sita KC',
      category: '6+ Months',
    },
  ];

  const filteredListings =
    activeFilter === 'All'
      ? listings
      : listings.filter((item) => item.category === activeFilter);

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="logo">
          <div className="logo-icon">🏠</div>
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

            <Link to="/outdated" className="nav-item active">
              Outdated
              <span className="badge">15</span>
            </Link>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Management</span>

            <Link to="/payments" className="nav-item">
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
              <h1>Outdated Listings</h1>
              <p>Listings that haven't been updated recently</p>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-section">
            <div className="filter-tabs">

              {filters.map((tab) => (
                <button
                  key={tab.label}
                  className={`filter-tab ${activeFilter === tab.label ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab.label)}
                >
                  <span>{tab.label}</span>
                  <span className="count">{tab.count}</span>
                </button>
              ))}

            </div>
          </div>

          {/* Listings */}
          <div className="listings-grid">

            {filteredListings.map((listing) => (
              <div className="listing-card" key={listing.id}>

                <div className="listing-image">📷</div>

                <div className="listing-info">

                  <h3>{listing.title}</h3>

                  <p className="location">{listing.location}</p>

                  <div className="listing-meta">
                    <span>Last Updated: {listing.updated}</span>
                    <span>By: {listing.by}</span>
                  </div>

                  <div className="listing-actions">
                    <button className="btn-sm view">View</button>
                    <button className="btn-sm edit">
                      Notify Landlord
                    </button>
                    <button className="btn-sm remove">
                      Delist
                    </button>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Outdated;