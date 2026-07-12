import { useEffect, useState } from 'react';
import { FaUsers, FaSearch, FaBan, FaCheckCircle, FaUserShield, FaEnvelope, FaIdCard, FaTimesCircle, FaTimes } from 'react-icons/fa';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers.js';
import Loader from '../../components/common/Loader.jsx';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(res => setUsers(res.data.data.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBan = async (id, isBanned, name) => {
    if (!confirm(`${isBanned ? 'Unban' : 'Ban'} ${name}?`)) return;
    try {
      const res = await api.patch(`/admin/users/${id}/ban`);
      toast.success(res.data.message);
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const handleVerifyIdentity = async () => {
    setSubmitting(true);
    try {
      await api.patch(`/admin/users/${modal.user.id}/verify-identity`, { status: modal.action, adminNote: note });
      toast.success(`Identity ${modal.action}`);
      setModal(null); setNote('');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const verificationBadge = (status) => {
    const map = {
      approved: { bg: '#E5EADF', color: '#566B4A', label: 'Verified' },
      pending:  { bg: '#FEF3D9', color: '#B45309', label: 'Pending review' },
      rejected: { bg: '#FBE9E5', color: '#C1442E', label: 'Rejected' },
      none:     { bg: '#F3E9D8', color: '#8A7B6C', label: 'Not submitted' },
    };
    const s = map[status] || map.none;
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text, #3D2B1F)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUsers style={{ color: '#C9662D' }} /> Users
          </h1>
          <p style={{ fontSize: '13px', color: '#8A7B6C', margin: '4px 0 0' }}>{users.length} registered users</p>
        </div>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7B6C', fontSize: '13px' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="input" style={{ paddingLeft: '36px', width: '260px' }} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size="lg" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                {['User', 'Role', 'Identity', 'Account', 'Joined', 'Action'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ opacity: u.is_banned ? 0.65 : 1 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#C9662D,#A8511F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#3D2B1F', margin: 0, fontSize: '14px' }}>{u.name}</p>
                        <p style={{ fontSize: '12px', color: '#8A7B6C', margin: 0 }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: u.role === 'landlord' ? '#F3DDC9' : '#E5EADF', color: u.role === 'landlord' ? '#A8511F' : '#566B4A', textTransform: 'capitalize' }}>
                      {u.role === 'landlord' ? <FaUserShield style={{ fontSize: '10px' }} /> : <FaUsers style={{ fontSize: '10px' }} />}
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {verificationBadge(u.verification_status)}
                    {u.role === 'user' && u.verification_status === 'pending' && (
                      <button
                        onClick={() => setModal({ user: u, action: 'approved' })}
                        style={{ display: 'block', marginTop: '4px', background: 'none', border: 'none', color: '#C9662D', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Review
                      </button>
                    )}
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: u.is_banned ? '#FBE9E5' : '#E5EADF', color: u.is_banned ? '#C1442E' : '#566B4A' }}>
                      {u.is_banned ? <FaBan style={{ fontSize: '10px' }} /> : <FaCheckCircle style={{ fontSize: '10px' }} />}
                      {u.is_banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#8A7B6C' }}>{formatDate(u.created_at)}</td>
                  <td>
                    <button onClick={() => handleBan(u.id, u.is_banned, u.name)}
                      className="btn btn-sm"
                      style={{ background: u.is_banned ? '#E5EADF' : '#FBE9E5', color: u.is_banned ? '#566B4A' : '#C1442E', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {u.is_banned ? <><FaCheckCircle style={{ fontSize: '11px' }} />Unban</> : <><FaBan style={{ fontSize: '11px' }} />Ban</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <p className="empty-state-title">No users found</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <p className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaIdCard style={{ color: '#C9662D' }} /> Review Identity
              </p>
              <button onClick={() => setModal(null)} className="modal-close"><FaTimes /></button>
            </div>
            <div style={{ background: '#FAF3E7', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#C9662D,#A8511F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                {modal.user.name[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: '14px' }}>{modal.user.name}</p>
                <p style={{ fontSize: '12px', color: '#8A7B6C', margin: 0 }}>{modal.user.email}</p>
              </div>
            </div>

            {(() => {
              let docs = null;
              try { docs = modal.user.verification_docs ? JSON.parse(modal.user.verification_docs) : null; } catch { docs = null; }
              return docs?.idImage ? (
                <div style={{ border: '1px solid #E8DCC8', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                  <img
                    src={docs.idImage}
                    alt="Submitted ID"
                    onClick={() => setLightbox(docs.idImage)}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'zoom-in', display: 'block' }}
                  />
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#3D2B1F', padding: '8px 10px', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaIdCard /> {docs.idType || 'ID document'} · click to enlarge
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: '#8A7B6C', marginBottom: '16px' }}>No document on file.</p>
              );
            })()}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setModal({ ...modal, action: 'approved' })}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: modal.action === 'approved' ? '2px solid #566B4A' : '1px solid #E8DCC8', background: modal.action === 'approved' ? '#E5EADF' : '#fff', color: '#566B4A', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <FaCheckCircle /> Approve
              </button>
              <button
                onClick={() => setModal({ ...modal, action: 'rejected' })}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: modal.action === 'rejected' ? '2px solid #C1442E' : '1px solid #E8DCC8', background: modal.action === 'rejected' ? '#FBE9E5' : '#fff', color: '#C1442E', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <FaTimesCircle /> Reject
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#3D2B1F', marginBottom: '6px' }}>
                Admin note {modal.action === 'rejected' ? '(reason for rejection)' : '(optional)'}
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                className="input" placeholder={modal.action === 'rejected' ? 'Please provide a reason...' : 'Optional note...'} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleVerifyIdentity} disabled={submitting}
                className="btn" style={{ flex: 1, background: '#C9662D', color: '#fff', border: 'none' }}>
                {submitting ? 'Processing...' : `Confirm ${modal.action}`}
              </button>
              <button onClick={() => setModal(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '24px', cursor: 'zoom-out' }}
        >
          <img src={lightbox} alt="Document" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

export default AdminUsers;