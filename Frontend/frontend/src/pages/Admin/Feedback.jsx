import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Feedback.css';
import '../../css/AdminCss/Sidebar.css';
import { fetchFeedback, handleResolve, handleReopen, getInitials, formatDate, typeClass, typeLabel, getCounts } from '../../scripts/AdminScripts/Feedback.js';

function Feedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => { fetchFeedback(setFeedbacks, setLoading); }, []);

  const filtered = feedbacks.filter(f => {
    if (activeFilter === 'All')        return true;
    if (activeFilter === 'Complaint')  return f.type === 'complaint';
    if (activeFilter === 'Suggestion') return f.type === 'suggestion';
    if (activeFilter === 'Bug Report') return f.type === 'bug_report';
    if (activeFilter === 'Pending')    return f.status === 'pending';
    if (activeFilter === 'Resolved')   return f.status === 'resolved';
    return true;
  });

  const counts = getCounts(feedbacks);

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
              <h1>Feedback & Complaints</h1>
              <p>Manage user feedback, complaints, and suggestions</p>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-tabs">
              {['All', 'Complaint', 'Suggestion', 'Bug Report', 'Pending', 'Resolved'].map(f => (
                <button
                  key={f}
                  className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f} <span className="count">{counts[f] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-container">
            {loading ? (
              <div className="no-data">Loading feedback...</div>
            ) : filtered.length === 0 ? (
              <div className="no-data">No feedback found.</div>
            ) : (
              filtered.map(f => (
                <div key={f.id} className={`feedback-item ${f.status === 'resolved' ? 'resolved' : 'pending'}`}>
                  <div className="feedback-header">
                    <div className="feedback-meta">
                      <div className="user-avatar">{getInitials(f.user_name)}</div>
                      <div className="feedback-info">
                        <span className="feedback-user">{f.user_name || 'Unknown User'}</span>
                        <span className="feedback-email">{f.user_email || ''}</span>
                      </div>
                    </div>
                    <div className="feedback-status">
                      <span className={`feedback-type ${typeClass(f.type)}`}>{typeLabel(f.type)}</span>
                      <span className="feedback-date">{formatDate(f.created_at)}</span>
                    </div>
                  </div>

                  <div className="feedback-content">
                    <h4>{f.title}</h4>
                    <p>{f.message}</p>
                  </div>

                  <div className="feedback-actions">
                    {f.status === 'pending' ? (
                      <>
                        <button className="btn btn-sm btn-primary" onClick={() => handleResolve(f.id, setFeedbacks, setLoading)}>Resolve</button>
                        <button className="btn btn-sm btn-outline">Message</button>
                        <button className="btn btn-sm btn-danger">Escalate</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline" onClick={() => handleReopen(f.id, setFeedbacks, setLoading)}>Reopen</button>
                        <button className="btn btn-sm btn-outline">Message</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Feedback;