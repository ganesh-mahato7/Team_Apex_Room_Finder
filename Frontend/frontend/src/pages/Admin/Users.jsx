import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Users.css';
import '../../css/AdminCss/Sidebar.css';
import { FiEye, FiEdit2, FiSlash, FiBell, FiMenu, FiSearch, FiUnlock } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { getInitials, filterLabels, countFor, getFiltered, handleSaveEdit } from '../../scripts/AdminScripts/Users.js';
import { refreshSidebar } from '../../scripts/AdminScripts/Sidebar.js';

const API = 'http://localhost:5000/api/v1';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
const fmtDateLong = (d) => new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

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
            {[
              ['Name',         user.name],
              ['Email',        user.email],
              ['Role',         <span style={{textTransform:'capitalize'}}>{user.role}</span>],
              ['Status',       <span className={`badge-status ${user.is_active ? 'active' : 'inactive'}`}>{user.is_active ? 'Active' : 'Inactive'}</span>],
              ['Verification', <span className={`badge-verify ${user.is_active ? 'verified' : 'unverified'}`}>{user.is_active ? 'Verified' : 'Unverified'}</span>],
              ['Joined',       fmtDateLong(user.created_at)],
              ['Blocked',      user.is_blocked ? 'Yes' : 'No'],
            ].map(([label, value]) => (
              <div className="modal-row" key={label}>
                <span className="modal-label">{label}</span>
                <span className="modal-value">{value}</span>
              </div>
            ))}
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
  const [form,    setForm]    = useState({ name: user.name, email: user.email, role: user.role });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);

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
              {[
                { label: 'Name',  type: 'text',  field: 'name' },
                { label: 'Email', type: 'email', field: 'email' },
              ].map(({ label, type, field }) => (
                <div className="form-group" key={field}>
                  <label>{label}</label>
                  <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
                </div>
              ))}
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
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
            <button className="btn btn-primary" onClick={() => handleSaveEdit(user, form, API, setSaving, setSuccess, onSave, onClose)} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── USER TABLE ──
function UserTable({ users, onToggleBlock, onUpdate, role }) {
  const [activeFilter, setActiveFilter] = useState(`All ${role}`);
  const [viewUser,     setViewUser]     = useState(null);
  const [editUser,     setEditUser]     = useState(null);

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
            <button key={label} className={`filter-tab ${activeFilter === label ? 'active' : ''}`} onClick={() => setActiveFilter(label)}>
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
              <tr><th>User</th><th>Email</th><th>Joined</th><th>Status</th><th>Verification</th><th>Blocked</th><th>Actions</th></tr>
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
                  <td>{fmtDate(u.created_at)}</td>
                  <td><span className={`badge-status ${u.is_active ? 'active' : 'inactive'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td><span className={`badge-verify ${u.is_active ? 'verified' : 'unverified'}`}>{u.is_active ? 'Verified' : 'Unverified'}</span></td>
                  <td><span className={`badge-status ${u.is_blocked ? 'inactive' : 'active'}`}>{u.is_blocked ? 'Blocked' : 'No'}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view"   title="View"   onClick={() => setViewUser(u)}><FiEye /></button>
                      <button className="action-btn edit"   title="Edit"   onClick={() => setEditUser(u)}><FiEdit2 /></button>
                      {u.is_blocked ? (
                        <button className="action-btn unblock" title="Unblock" onClick={() => onToggleBlock(u, false)}><FiUnlock /></button>
                      ) : (
                        <button className="action-btn block"   title="Block"   onClick={() => onToggleBlock(u, true)}><FiSlash /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>
    </>
  );
}

// ── TABS CONFIG ──
const TABS = [
  { id: 'users',     label: 'Users',     role: 'Users' },
  { id: 'landlords', label: 'Landlords', role: 'Landlords' },
  { id: 'tenants',   label: 'Tenants',   role: 'Tenants' },
];

// ── MAIN USERS PAGE ──
function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab,   setActiveTab]   = useState('users');
  const [allUsers,    setAllUsers]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/users/all`, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => { setAllUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Toggle block/unblock without page refresh
  const handleToggleBlock = async (user, block) => {
    const endpoint = block ? 'block' : 'unblock';
    try {
      const res = await fetch(`${API}/admin/users/${endpoint}/${user.id}`, {
        method: 'PUT',
        headers: authHeaders(),
      });
      if (res.ok) {
        setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_blocked: block } : u));
        refreshSidebar();
      } else {
        alert(`Failed to ${endpoint} user`);
      }
    } catch {
      alert('Server error');
    }
  };

  const handleUpdate = (updated) => setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));

  const users     = allUsers.filter(u => u.role === 'user');
  const landlords = allUsers.filter(u => u.role === 'landlord');
  const tenants   = allUsers.filter(u => u.role === 'tenant');
  const counts    = { users: users.length, landlords: landlords.length, tenants: tenants.length };
  const dataMap   = { users, landlords, tenants };

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">

        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><FiMenu size={24} /></button>
            <div className="search-box">
              <FiSearch size={20} />
              <input type="text" placeholder="Search users..." />
            </div>
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
              <h1>User Management</h1>
              <p>Manage all users, landlords, and tenants from one place</p>
            </div>
          </div>

          <div className="user-tab-switcher">
            {TABS.map(t => (
              <button key={t.id} className={`user-tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                <span className="user-tab-label">{t.label}</span>
                <span className="user-tab-count">{counts[t.id]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="tab-content-area">
              {TABS.map(t => activeTab === t.id && (
                <UserTable
                  key={t.id}
                  users={dataMap[t.id]}
                  onToggleBlock={handleToggleBlock}
                  onUpdate={handleUpdate}
                  role={t.role}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Users;