import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Analytics.css';
import '../../css/AdminCss/Sidebar.css';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { fetchAnalytics, mergeMonthlyData, formatRevenue, downloadReport } from '../../scripts/AdminScripts/Analytics.js';

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics(setStats, setLoading);
  }, []);

  const chartData = mergeMonthlyData(stats);

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
              <h1>Analytics & Reports</h1>
              <p>Platform statistics and performance reports</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-msg">Loading analytics...</div>
          ) : (
            <>
              {/* STAT CARDS */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👤</div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.totalUsers ?? 0}</span>
                    <span className="stat-label">Total Users</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏠</div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.totalListings ?? 0}</span>
                    <span className="stat-label">Active Listings</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <span className="stat-value">{formatRevenue(stats?.totalRevenue ?? 0)}</span>
                    <span className="stat-label">Revenue</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏘️</div>
                  <div className="stat-info">
                    <span className="stat-value">{stats?.totalLandlords ?? 0}</span>
                    <span className="stat-label">Landlords</span>
                  </div>
                </div>
              </div>

              {/* CHARTS */}
              <div className="charts-section">
                <h2>Usage Trends — Last 6 Months</h2>
                {chartData.length === 0 ? (
                  <div className="chart-placeholder">📊 No data yet — add listings and payments to see charts</div>
                ) : (
                  <div className="charts-row">
                    <div className="chart-box">
                      <h3>Users & Listings Growth</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="Users" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="Listings" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-box">
                      <h3>Monthly Revenue (Rs.)</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}`} />
                          <Tooltip formatter={(val) => [`Rs. ${val}`, 'Revenue']} />
                          <Bar dataKey="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* RECENT REPORTS */}
              <div className="reports-section">
                <h2>Recent Reports</h2>
                <div className="report-list">
                  <div className="report-item">
                    <div className="report-info">
                      <span className="report-name">Monthly User Growth</span>
                      <span className="report-desc">{stats?.totalUsers} total users registered</span>
                    </div>
                    <button className="btn-sm" onClick={() => downloadReport(stats?.usersByMonth, 'month', 'users', 'user-growth.txt')}>
                      Download
                    </button>
                  </div>
                  <div className="report-item">
                    <div className="report-info">
                      <span className="report-name">Listing Performance</span>
                      <span className="report-desc">{stats?.totalListings} total listings on platform</span>
                    </div>
                    <button className="btn-sm" onClick={() => downloadReport(stats?.listingsByMonth, 'month', 'listings', 'listing-performance.txt')}>
                      Download
                    </button>
                  </div>
                  <div className="report-item">
                    <div className="report-info">
                      <span className="report-name">Revenue Summary</span>
                      <span className="report-desc">{formatRevenue(stats?.totalRevenue ?? 0)} total platform revenue</span>
                    </div>
                    <button className="btn-sm" onClick={() => downloadReport(stats?.revenueByMonth, 'month', 'total', 'revenue-summary.txt', true)}>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Analytics;