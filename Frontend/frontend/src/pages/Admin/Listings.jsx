import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Listing.css';
import '../../css/AdminCss/Sidebar.css';
import { filters, listings, getFiltered } from '../../scripts/AdminScripts/Listings.js';

function Listings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const filtered = getFiltered(listings, activeFilter);

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-dot"></span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
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
            <div className="page-title">
              <h1>All Listings</h1>
              <p>Manage all property listings</p>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-tabs">
              {filters.map(t => (
                <button
                  key={t.label}
                  className={`filter-tab ${activeFilter === t.label ? 'active' : ''}`}
                  onClick={() => setActiveFilter(t.label)}
                >
                  <span>{t.label}</span>
                  <span className="count">{t.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="listings-grid">
            {filtered.map(l => (
              <div className="listing-card" key={l.id}>
                <div className="listing-image">📷</div>
                <div className="listing-info">
                  <h3>{l.title}</h3>
                  <p className="location">{l.location}</p>
                  <p className="price">{l.price}</p>
                  <div className="listing-meta">
                    <span>By: {l.by}</span>
                    <span>Listed: {l.listed}</span>
                  </div>
                  <div className="listing-actions">
                    <button className="btn-sm view">View</button>
                    <button className="btn-sm edit">Edit</button>
                    <button className="btn-sm remove">Remove</button>
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

export default Listings;