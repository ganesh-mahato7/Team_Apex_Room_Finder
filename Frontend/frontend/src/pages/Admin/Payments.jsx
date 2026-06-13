import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Payments.css';
import '../../css/AdminCss/Sidebar.css';
import { fetchPayments, getFiltered, getStats, formatRs, formatDate, downloadCSV } from '../../scripts/AdminScripts/Payments.js';

function Payments() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Transactions');
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => { fetchPayments(setPayments, setLoading); }, []);

  const filtered    = getFiltered(payments, activeFilter);
  const { totalCommission, thisMonth, totalTxn, successRate } = getStats(payments);

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
              <h1>Payments & Commission</h1>
              <p>Manage transactions and commission tracking</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-outline" onClick={() => downloadCSV(filtered, formatDate)}>Export Report</button>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">{formatRs(totalCommission)}</span>
                <span className="stat-label">Total Commission</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">{formatRs(thisMonth)}</span>
                <span className="stat-label">This Month</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">{totalTxn}</span>
                <span className="stat-label">Transactions</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">{successRate}%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="filter-section">
            <h3>Commission Tracking</h3>
            <div className="filter-tabs">
              {['All Transactions', 'Completed', 'Pending', 'Failed'].map(f => (
                <button
                  key={f}
                  className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="card">
            <div className="card-header">
              <h3>Transaction History</h3>
              <button className="view-all-btn" onClick={() => downloadCSV(filtered, formatDate)}>Download CSV</button>
            </div>
            <div className="card-content">
              {loading ? (
                <div className="loading-msg">Loading payments...</div>
              ) : filtered.length === 0 ? (
                <div className="no-data">No transactions found.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Tenant</th>
                      <th>Landlord</th>
                      <th>Amount</th>
                      <th>Commission</th>
                      <th>Platform Fees</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id}>
                        <td>#TXN-{p.id}</td>
                        <td>{p.tenant_name   || 'N/A'}</td>
                        <td>{p.landlord_name || 'N/A'}</td>
                        <td>Rs. {parseFloat(p.amount).toLocaleString()}</td>
                        <td className="commission">Rs. {parseFloat(p.commission).toLocaleString()}</td>
                        <td>Rs. {parseFloat(p.platform_fee).toLocaleString()}</td>
                        <td>{formatDate(p.created_at)}</td>
                        <td>
                          <span className={`status-badge ${
                            p.status === 'completed' ? 'success' :
                            p.status === 'pending'   ? 'pending' : 'failed'
                          }`}>
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Payments;