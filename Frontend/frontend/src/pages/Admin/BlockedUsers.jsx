import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/BlockedUsers.css';
import '../../css/AdminCss/Sidebar.css';
import { refreshSidebar } from '../../scripts/AdminScripts/Sidebar.js';

const API = 'http://localhost:5000/api/v1/admin';

function BlockedUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    userId: null,
  });

  const [successModal, setSuccessModal] = useState({
    show: false,
    message: '',
  });

  useEffect(() => {
    fetch(`${API}/users/all`)
      .then(res => res.json())
      .then(data => {
        const blocked = data.filter(user => user.is_blocked === true);
        setBlockedUsers(blocked);
        setLoading(false);
      })
      .catch(err => {
        console.error('Blocked users error:', err);
        setLoading(false);
      });
  }, []);

  const askUnblock = (id) => {
    setConfirmModal({
      show: true,
      userId: id,
    });
  };

  const confirmUnblock = async () => {
    try {
      const id = confirmModal.userId;

      await fetch(`${API}/users/unblock/${id}`, {
        method: 'PUT',
      });

      setBlockedUsers(prev =>
        prev.filter(user => user.id !== id)
      );

      refreshSidebar();

      setConfirmModal({
        show: false,
        userId: null,
      });

      setSuccessModal({
        show: true,
        message: 'User unblocked successfully!',
      });
    } catch (err) {
      console.error(err);

      setSuccessModal({
        show: true,
        message: 'Failed to unblock user!',
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';

    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filters = [
    {
      label: 'All',
      count: blockedUsers.length,
    },
    {
      label: 'Blocked',
      count: blockedUsers.length,
    },
  ];

  const filteredUsers = blockedUsers.filter(user => {
    if (activeFilter === 'Blocked') {
      return user.is_blocked === true;
    }

    return true;
  });

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />

      <main className="main-content">

        <header className="header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>

          <div className="header-right">
            <div className="admin-profile">
              <div className="admin-avatar">
                A
              </div>

              <div className="admin-info">
                <span className="admin-name">
                  Admin User
                </span>

                <span className="admin-role">
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Blocked Users</h1>
              <p>
                Manage blocked users
              </p>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-tabs">

              {filters.map(filter => (
                <button
                  key={filter.label}
                  className={`filter-tab ${
                    activeFilter === filter.label
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => setActiveFilter(filter.label)}
                >
                  <span>{filter.label}</span>

                  <span className="count">
                    {filter.count}
                  </span>
                </button>
              ))}

            </div>
          </div>

          <div className="card">
            <div className="card-content">

              {loading ? (
                <div className="no-data">
                  Loading...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="no-data">
                  No blocked users found.
                </div>
              ) : (

                <table className="data-table">

                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredUsers.map(user => (

                      <tr key={user.id}>

                        <td>
                          <div className="user-row">

                            <div className="user-avatar">
                              {getInitials(user.name)}
                            </div>

                            <span>{user.name}</span>

                          </div>
                        </td>

                        <td>{user.email}</td>

                        <td style={{ textTransform: 'capitalize' }}>
                          {user.role}
                        </td>

                        <td>
                          <span className="badge-blocked">
                            Blocked
                          </span>
                        </td>

                        <td>
                          {new Date(user.created_at)
                            .toLocaleDateString()}
                        </td>

                        <td>

                          <div className="action-buttons">

                            <button
                              className="action-btn view"
                              onClick={() => setViewUser(user)}
                            >
                              View
                            </button>

                            <button
                              className="action-btn unblock"
                              onClick={() => askUnblock(user.id)}
                            >
                              Unblock
                            </button>

                          </div>

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

      {/* VIEW USER MODAL */}

      {viewUser && (
        <div
          className="modal-overlay"
          onClick={() => setViewUser(null)}
        >

          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <h3>User Details</h3>

              <button
                className="modal-close"
                onClick={() => setViewUser(null)}
              >
                ✕
              </button>

            </div>

            <div className="modal-body">

              <div className="modal-avatar">
                {getInitials(viewUser.name)}
              </div>

              <div className="modal-info">

                <div className="modal-row">
                  <span className="modal-label">
                    Name
                  </span>

                  <span className="modal-value">
                    {viewUser.name}
                  </span>
                </div>

                <div className="modal-row">
                  <span className="modal-label">
                    Email
                  </span>

                  <span className="modal-value">
                    {viewUser.email}
                  </span>
                </div>

                <div className="modal-row">
                  <span className="modal-label">
                    Role
                  </span>

                  <span className="modal-value">
                    {viewUser.role}
                  </span>
                </div>

                <div className="modal-row">
                  <span className="modal-label">
                    Status
                  </span>

                  <span className="badge-blocked">
                    Blocked
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* CONFIRM MODAL */}

      {confirmModal.show && (
        <div className="modal-overlay">

          <div className="modal-box confirm-box">

            <div className="modal-header">

              <h3>Confirm Unblock</h3>

              <button
                className="modal-close"
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    userId: null,
                  })
                }
              >
                ✕
              </button>

            </div>

            <div className="confirm-body">

              <p className="confirm-text">
                Are you sure you want to unblock this user?
              </p>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-outline"
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    userId: null,
                  })
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                onClick={confirmUnblock}
              >
                Yes, Unblock
              </button>

            </div>

          </div>

        </div>
      )}

      {/* SUCCESS MODAL */}

      {successModal.show && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSuccessModal({
              show: false,
              message: '',
            })
          }
        >

          <div
            className="modal-box confirm-box"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <h3>Message</h3>

              <button
                className="modal-close"
                onClick={() =>
                  setSuccessModal({
                    show: false,
                    message: '',
                  })
                }
              >
                ✕
              </button>

            </div>

            <div className="confirm-body">

              <p className="confirm-text">
                {successModal.message}
              </p>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-primary"
                onClick={() =>
                  setSuccessModal({
                    show: false,
                    message: '',
                  })
                }
              >
                OK
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default BlockedUsers;