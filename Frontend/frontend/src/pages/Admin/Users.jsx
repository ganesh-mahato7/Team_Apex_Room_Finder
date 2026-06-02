import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Users.css';
import '../../css/AdminCss/Sidebar.css';
import { getInitials, filterLabels, countFor, getFiltered, handleBlockUser, handleSaveEdit } from '../../scripts/AdminScripts/Users.js';

const API = 'http://localhost:5000/api/v1';

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
            <div className="modal-row"><span className="modal-label">Status</span><span className={`badge-status ${user.is_active ? 'active' : 'inactive'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></div>
            <div className="modal-row"><span className="modal-label">Verification</span><span className={`badge-verify ${user.is_active ? 'verified' : 'unverified'}`}>{user.is_active ? 'Verified' : 'Unverified'}</span></div>
            <div className="modal-row"><span className="modal-label">Joined</span><span className="modal-value">{new Date(user.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</span></div>
            <div className="modal-row"><span className="modal-label">Blocked</span><span className="modal-value">{user.is_blocked ? 'Yes' : 'No'}</span></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── EDIT MODAL ──
function EditModal({ user, onClose, onSave }) {
  const [form, setForm]       = useState({ name: user.name, email: user.email, role: user.role });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () =>
    handleSaveEdit(user, form, API, setSaving, setSuccess, onSave, onClose);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {success ? (
            <div className="success-msg">User updated successfully!</div>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="user">User</option>
                  <option value="landlord">Landlord</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>
            </div>
          )}
        </div>
        {!success && (
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── USER TABLE ──
function UserTable({ users, onBlock, onUpdate, role }) {
  const [activeFilter, setActiveFilter] = useState(`All ${role}`);
  const [viewUser, setViewUser]         = useState(null);
  const [editUser, setEditUser]         = useState(null);

  const labels   = filterLabels(role);
  const filtered = getFiltered(users, activeFilter);

  return (
    <>
      {viewUser && <ViewModal user={viewUser} onClose={() => setViewUser(null)} />}
      {editUser && (
        <EditModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={(updated) => { onUpdate(updated); setEditUser(null); }}
        />
      )}

      <div className="filter-section">
        <div className="filter-tabs">
          {labels.map(label => (
            <button
              key={label}
              className={`filter-tab ${activeFilter === label ? 'active' : ''}`}
              onClick={() => setActiveFilter(label)}
            >
              <span>{label}</span>
              <span className="count">{countFor(users, label)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card"><div className="card-content">
        {filtered.length === 0 ? (
          <div className="no-data">No {role.toLowerCase()} found.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Joined</th><th>Status</th><th>Verification</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><div className="user-row"><div className="user-avatar">{getInitials(u.name)}</div><span>{u.name}</span></div></td>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</td>
                  <td><span className={`badge-status ${u.is_active ? 'active' : 'inactive'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td><span className={`badge-verify ${u.is_active ? 'verified' : 'unverified'}`}>{u.is_active ? 'Verified' : 'Unverified'}</span></td>
                  <td><div className="action-buttons">
                    <button className="action-btn view" title="View" onClick={() => setViewUser(u)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button className="action-btn edit" title="Edit" onClick={() => setEditUser(u)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="action-btn block" title="Block" onClick={() => handleBlockUser(u, API, onBlock)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                    </button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </>
  );
}

// ── MAIN USERS PAGE ──
function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab]     = useState('users');
  const [allUsers, setAllUsers]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/users/all`)
      .then(res => res.json())
      .then(data => { setAllUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const users     = allUsers.filter(u => u.role === 'user');
  const landlords = allUsers.filter(u => u.role === 'landlord');
  const tenants   = allUsers.filter(u => u.role === 'tenant');

  const handleBlock  = (id)      => setAllUsers(prev => prev.filter(u => u.id !== id));
  const handleUpdate = (updated) => setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));

  const tabs = [
    { id: 'users',     label: 'Users',     count: users.length,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> },
    { id: 'landlords', label: 'Landlords', count: landlords.length,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { id: 'tenants',   label: 'Tenants',   count: tenants.length,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search users..." />
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
            <div className="page-title">
              <h1>User Management</h1>
              <p>Manage all users, landlords, and tenants from one place</p>
            </div>
          </div>

          <div className="user-tab-switcher">
            {tabs.map(t => (
              <button key={t.id} className={`user-tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                <span className="user-tab-icon">{t.icon}</span>
                <span className="user-tab-label">{t.label}</span>
                <span className="user-tab-count">{t.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="tab-content-area">
              {activeTab === 'users'     && <UserTable users={users}     onBlock={handleBlock} onUpdate={handleUpdate} role="Users" />}
              {activeTab === 'landlords' && <UserTable users={landlords} onBlock={handleBlock} onUpdate={handleUpdate} role="Landlords" />}
              {activeTab === 'tenants'   && <UserTable users={tenants}   onBlock={handleBlock} onUpdate={handleUpdate} role="Tenants" />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Users; 