import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/BlockedUsers.css';
import '../../css/AdminCss/Sidebar.css';
import { FiMenu, FiBell, FiEye, FiUnlock } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { fetchBlockedUsers, getInitials, formatDate, confirmUnblockUser } from '../../scripts/AdminScripts/BlockedUsers.js';
import { refreshSidebar } from '../../scripts/AdminScripts/Sidebar.js';

// ── VIEW MODAL ──
function ViewModal({ user, onClose }) {
  if (!user) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>User Details</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-avatar">{getInitials(user.name)}</div>
          <div className="modal-info">
            <div className="modal-row"><span className="modal-label">Name</span><span className="modal-value">{user.name}</span></div>
            <div className="modal-row"><span className="modal-label">Email</span><span className="modal-value">{user.email}</span></div>
            <div className="modal-row"><span className="modal-label">Role</span><span className="modal-value" style={{textTransform:'capitalize'}}>{user.role}</span></div>
            <div className="modal-row"><span className="modal-label">Joined</span><span className="modal-value">{formatDate(user.created_at, true)}</span></div>
            <div className="modal-row"><span className="modal-label">Status</span><span className="badge-blocked">Blocked</span></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── CONFIRM MODAL ──
function ConfirmModal({ user, onConfirm, onClose }) {
  if (!user) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box confirm-box">
        <div className="modal-header">
          <h3>Confirm Unblock</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="confirm-body">
          <p className="confirm-text">Are you sure you want to unblock <strong>{user.name}</strong>?</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={onConfirm}>Yes, Unblock</button>
        </div>
      </div>
    </div>
  );
}

// ── SUCCESS MODAL ──
function SuccessModal({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Success</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="confirm-body">
          <p className="confirm-text">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──
function BlockedUsers() {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [viewUser,     setViewUser]     = useState(null);
  const [confirmUser,  setConfirmUser]  = useState(null);
  const [successMsg,   setSuccessMsg]   = useState('');

  useEffect(() => {
    fetchBlockedUsers(setBlockedUsers, setLoading);
  }, []);

  const handleUnblock = (user) => setConfirmUser(user);

  const handleConfirm = async () => {
    await confirmUnblockUser(confirmUser, setBlockedUsers, setConfirmUser, setSuccessMsg);
    refreshSidebar();
  };

  const filters = [
    { label: 'All',     count: blockedUsers.length },
    { label: 'Blocked', count: blockedUsers.length },
  ];

  const filtered = activeFilter === 'Blocked'
    ? blockedUsers.filter(u => u.is_blocked)
    : blockedUsers;

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><FiMenu size={24} /></button>
          </div>
          <div className="header-right">
            <button className="header-btn"><FiBell size={20} /><span className="notification-dot"></span></button>
            <div className="admin-profile">
              <div className="admin-avatar"><FaUserCircle size={24} /></div>
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
              <h1>Blocked Users</h1>
              <p>Manage and unblock restricted users</p>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-tabs">
              {filters.map(f => (
                <button key={f.label} className={`filter-tab ${activeFilter === f.label ? 'active' : ''}`} onClick={() => setActiveFilter(f.label)}>
                  <span>{f.label}</span>
                  <span className="count">{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card"><div className="card-content">
            {loading ? (
              <div className="no-data">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="no-data">No blocked users found.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-row">
                          <div className="user-avatar">{getInitials(u.name)}</div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td style={{textTransform:'capitalize'}}>{u.role}</td>
                      <td><span className="badge-blocked">Blocked</span></td>
                      <td>{formatDate(u.created_at)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view"    title="View"    onClick={() => setViewUser(u)}><FiEye /></button>
                          <button className="action-btn unblock" title="Unblock" onClick={() => handleUnblock(u)}><FiUnlock /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div></div>
        </div>
      </main>

      <ViewModal    user={viewUser}    onClose={() => setViewUser(null)} />
      <ConfirmModal user={confirmUser} onConfirm={handleConfirm} onClose={() => setConfirmUser(null)} />
      <SuccessModal message={successMsg} onClose={() => setSuccessMsg('')} />
    </div>
  );
}

export default BlockedUsers;