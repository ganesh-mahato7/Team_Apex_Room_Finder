import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Reported.css';
import '../../css/AdminCss/Sidebar.css';
import { initialReports, getFilters, getFiltered, handleDelete, handleBlock } from '../../scripts/AdminScripts/Reported.js';

function Reported() {
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [activeFilter, setActiveFilter]     = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports]               = useState(initialReports);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const filters  = getFilters(reports);
  const filtered = getFiltered(reports, activeFilter);

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-dot"></span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <h1>Reported Listings</h1>
              <p>Review and take action on user-reported listings</p>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-tabs">
              {filters.map(f => (
                <button
                  key={f.label}
                  className={`filter-tab ${activeFilter === f.label ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.label)}
                >
                  <span>{f.label}</span>
                  <span className="count">{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Reported By</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="listing-info">
                          <div className="listing-thumb">📷</div>
                          <div>
                            <span className="listing-title">{r.title}</span>
                            <span className="listing-id">{r.listingId}</span>
                          </div>
                        </div>
                      </td>
                      <td>{r.reportedBy}</td>
                      <td><span className={`reason-tag ${r.reason}`}>{r.reasonLabel}</span></td>
                      <td>{r.date}</td>
                      <td><span className={`status-badge ${r.status}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" title="View Report" onClick={() => setSelectedReport(r)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button className="action-btn delete" title="Delete Listing" onClick={() => handleDelete(r.id, setReports)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                          <button className="action-btn block" title="Block User" onClick={() => handleBlock(r.id, setReports)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* View Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Details</h2>
              <button className="modal-close" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-row"><span className="modal-label">Listing</span><span className="modal-value">{selectedReport.title}</span></div>
              <div className="modal-row"><span className="modal-label">Listing ID</span><span className="modal-value">{selectedReport.listingId}</span></div>
              <div className="modal-row"><span className="modal-label">Reported By</span><span className="modal-value">{selectedReport.reportedBy}</span></div>
              <div className="modal-row"><span className="modal-label">Reason</span><span className={`reason-tag ${selectedReport.reason}`}>{selectedReport.reasonLabel}</span></div>
              <div className="modal-row"><span className="modal-label">Date</span><span className="modal-value">{selectedReport.date}</span></div>
              <div className="modal-row"><span className="modal-label">Status</span><span className={`status-badge ${selectedReport.status}`}>{selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}</span></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedReport(null)}>Close</button>
              <button className="btn btn-danger" onClick={() => { handleDelete(selectedReport.id, setReports); setSelectedReport(null); }}>Delete Listing</button>
              <button className="btn btn-warning" onClick={() => { handleBlock(selectedReport.id, setReports); setSelectedReport(null); }}>Block User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reported;