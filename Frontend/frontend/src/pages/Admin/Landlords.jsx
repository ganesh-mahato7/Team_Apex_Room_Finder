import { useEffect, useState } from 'react';
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaIdCard, FaCamera, FaFileAlt, FaBuilding, FaTimes } from 'react-icons/fa';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { STATUS_COLORS } from '../../utils/constants.js';
import { formatDate } from '../../utils/helpers.js';
import Loader from '../../components/common/Loader.jsx';

const AdminLandlords = () => {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLandlords = () => {
    setLoading(true);
    const url = filter === 'pending' ? '/admin/landlords/pending' : '/admin/landlords';
    api.get(url)
      .then(res => setLandlords(res.data.data.landlords))
      .catch(() => setLandlords([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLandlords(); }, [filter]);

  const handleVerify = async () => {
    setSubmitting(true);
    try {
      await api.patch(`/admin/landlords/${modal.landlord.id}/verify`, { status: modal.action, adminNote: note });
      toast.success(`Landlord ${modal.action}`);
      setModal(null); setNote('');
      fetchLandlords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUserShield style={{ color: '#d97706' }} /> Landlords
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: '4px 0 0' }}>Review and approve landlord verification requests</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size="lg" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>{['Landlord', 'Status', 'Documents', 'Joined', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {landlords.map(l => {
                const docs = l.verification_docs ? JSON.parse(l.verification_docs) : null;
                const statusColors = { approved: { bg: '#dcfce7', color: '#15803d' }, pending: { bg: '#fef9c3', color: '#854d0e' }, rejected: { bg: '#fee2e2', color: '#b91c1c' }, none: { bg: 'var(--gray-100)', color: 'var(--gray-500)' } }[l.verification_status] || {};
                return (
                  <tr key={l.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#d97706,#b45309)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                          {l.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--gray-900)', margin: 0, fontSize: '14px' }}>{l.name}</p>
                          <p style={{ fontSize: '12px', color: 'var(--gray-500)', margin: 0 }}>{l.email}</p>
                          {l.phone && <p style={{ fontSize: '11px', color: 'var(--gray-400)', margin: 0 }}>{l.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ ...statusColors, padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize' }}>
                        {l.verification_status}
                      </span>
                    </td>
                    <td>
                      {docs ? (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {[{ url: docs.idImage, icon: <FaIdCard />, label: 'ID' }, { url: docs.selfie, icon: <FaCamera />, label: 'Selfie' }, { url: docs.landDocument, icon: <FaFileAlt />, label: 'Land Doc' }, { url: docs.buildingImage, icon: <FaBuilding />, label: 'Building' }].filter(d => d.url).map(d => (
                            <a key={d.label} href={d.url} target="_blank" rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '6px', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>
                              {d.icon}{d.label}
                            </a>
                          ))}
                        </div>
                      ) : <span style={{ color: 'var(--gray-400)', fontSize: '13px' }}>No docs</span>}
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--gray-500)' }}>{formatDate(l.created_at)}</td>
                    <td>
                      {l.verification_status === 'pending' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setModal({ landlord: l, action: 'approved' })}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>
                            <FaCheckCircle style={{ fontSize: '11px' }} />Approve
                          </button>
                          <button onClick={() => setModal({ landlord: l, action: 'rejected' })}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>
                            <FaTimesCircle style={{ fontSize: '11px' }} />Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {landlords.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <FaUserShield className="empty-state-icon" />
              <p className="empty-state-title">No landlords found</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <p className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {modal.action === 'approved' ? <FaCheckCircle style={{ color: '#15803d' }} /> : <FaTimesCircle style={{ color: 'var(--danger)' }} />}
                {modal.action === 'approved' ? 'Approve' : 'Reject'} Landlord
              </p>
              <button onClick={() => setModal(null)} className="modal-close"><FaTimes /></button>
            </div>
            <div style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#d97706,#b45309)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                {modal.landlord.name[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: '14px' }}>{modal.landlord.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--gray-500)', margin: 0 }}>{modal.landlord.email}</p>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px' }}>
                Admin note {modal.action === 'rejected' ? '(reason for rejection)' : '(optional)'}
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                className="input" placeholder={modal.action === 'rejected' ? 'Please provide a reason...' : 'Optional note...'} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleVerify} disabled={submitting}
                className={`btn ${modal.action === 'approved' ? 'btn-primary' : 'btn-danger'}`} style={{ flex: 1 }}>
                {submitting ? 'Processing...' : `Confirm ${modal.action}`}
              </button>
              <button onClick={() => setModal(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLandlords;