import { useEffect, useState } from 'react';
import { FaUserShield, FaCheckCircle, FaTimesCircle, FaIdCard, FaCamera, FaFileAlt, FaBuilding, FaTimes } from 'react-icons/fa';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers.js';
import Loader from '../../components/common/Loader.jsx';

const COLORS = { primary: '#C9662D', text: '#3D2B1F', muted: '#8A7B6C', border: '#E8DCC8', bg: '#FAF3E7', white: '#FFFFFF' };

const AdminLandlords = () => {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lightbox, setLightbox] = useState(null);

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

  const openReview = (landlord) => {
    let docs = null;
    try { docs = landlord.verification_docs ? JSON.parse(landlord.verification_docs) : null; } catch { docs = null; }
    setModal({ landlord, action: 'approved', docs });
    setNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: COLORS.text, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUserShield style={{ color: COLORS.primary }} /> Landlords
          </h1>
          <p style={{ fontSize: '13px', color: COLORS.muted, margin: '4px 0 0' }}>Review and approve landlord verification requests</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer',
                border: filter === f ? 'none' : `1px solid ${COLORS.border}`,
                background: filter === f ? COLORS.primary : COLORS.white,
                color: filter === f ? COLORS.white : COLORS.muted,
              }}>
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
                const hasDocs = !!l.verification_docs;
                const statusColors = {
                  approved: { bg: '#E5EADF', color: '#566B4A' },
                  pending:  { bg: '#FEF3D9', color: '#B45309' },
                  rejected: { bg: '#FBE9E5', color: '#C1442E' },
                  none:     { bg: '#F3E9D8', color: '#8A7B6C' },
                }[l.verification_status] || {};
                return (
                  <tr key={l.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#C9662D,#A8511F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                          {l.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: COLORS.text, margin: 0, fontSize: '14px' }}>{l.name}</p>
                          <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0 }}>{l.email}</p>
                          {l.phone && <p style={{ fontSize: '11px', color: COLORS.muted, margin: 0 }}>{l.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ ...statusColors, padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize' }}>
                        {l.verification_status}
                      </span>
                    </td>
                    <td>
                      {hasDocs ? (
                        <button
                          onClick={() => openReview(l)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', border: 'none', background: '#FBF0E8', color: '#A8511F', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <FaIdCard style={{ fontSize: '11px' }} />Review documents
                        </button>
                      ) : <span style={{ color: COLORS.muted, fontSize: '13px' }}>No docs</span>}
                    </td>
                    <td style={{ fontSize: '13px', color: COLORS.muted }}>{formatDate(l.created_at)}</td>
                    <td>
                      {l.verification_status === 'pending' && !hasDocs && (
                        <span style={{ fontSize: '12px', color: COLORS.muted }}>Awaiting docs</span>
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

      {/* Review modal with inline document previews */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,31,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: COLORS.white, borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: COLORS.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaUserShield style={{ color: COLORS.primary }} /> Review Landlord Documents
              </p>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, fontSize: '16px' }}><FaTimes /></button>
            </div>

            <div style={{ background: COLORS.bg, borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#C9662D,#A8511F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                {modal.landlord.name[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: '14px', color: COLORS.text }}>{modal.landlord.name}</p>
                <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0 }}>{modal.landlord.email}</p>
              </div>
            </div>

            {modal.docs ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { url: modal.docs.idImage, icon: <FaIdCard />, label: `ID (${modal.docs.idType || 'document'})` },
                  { url: modal.docs.selfie, icon: <FaCamera />, label: 'Selfie with ID' },
                  { url: modal.docs.landDocument, icon: <FaFileAlt />, label: 'Land Document' },
                  { url: modal.docs.buildingImage, icon: <FaBuilding />, label: 'Building Image' },
                ].filter(d => d.url).map(d => (
                  <div key={d.label} style={{ border: `1px solid ${COLORS.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                    <img
                      src={d.url}
                      alt={d.label}
                      onClick={() => setLightbox(d.url)}
                      style={{ width: '100%', height: '120px', objectFit: 'cover', cursor: 'pointer', display: 'block' }}
                    />
                    <p style={{ fontSize: '11px', fontWeight: 700, color: COLORS.text, padding: '6px 10px', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {d.icon} {d.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '20px' }}>No documents on file.</p>
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setModal({ ...modal, action: 'approved' })}
                style={{ flex: 1, padding: '9px', borderRadius: '8px', border: modal.action === 'approved' ? '2px solid #566B4A' : `1px solid ${COLORS.border}`, background: modal.action === 'approved' ? '#E5EADF' : COLORS.white, color: '#566B4A', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <FaCheckCircle /> Approve
              </button>
              <button
                onClick={() => setModal({ ...modal, action: 'rejected' })}
                style={{ flex: 1, padding: '9px', borderRadius: '8px', border: modal.action === 'rejected' ? '2px solid #C1442E' : `1px solid ${COLORS.border}`, background: modal.action === 'rejected' ? '#FBE9E5' : COLORS.white, color: '#C1442E', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <FaTimesCircle /> Reject
              </button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.text, marginBottom: '6px' }}>
                Admin note {modal.action === 'rejected' ? '(reason for rejection)' : '(optional)'}
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                className="input" placeholder={modal.action === 'rejected' ? 'Please provide a reason...' : 'Optional note...'} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleVerify} disabled={submitting}
                style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: COLORS.primary, color: COLORS.white, fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                {submitting ? 'Processing...' : `Confirm ${modal.action}`}
              </button>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.muted, fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image lightbox */}
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

export default AdminLandlords;