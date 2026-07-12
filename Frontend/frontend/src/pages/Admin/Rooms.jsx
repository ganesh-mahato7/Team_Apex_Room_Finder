import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaTimesCircle, FaTrash, FaMapMarkerAlt, FaTimes, FaImage, FaEye } from 'react-icons/fa';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { STATUS_COLORS } from '../../utils/constants.js';
import { formatPrice, formatDate } from '../../utils/helpers.js';
import Loader from '../../components/common/Loader.jsx';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    const url = filter === 'pending' ? '/admin/rooms/pending' : `/admin/rooms?status=${filter}`;
    api.get(url)
      .then(res => setRooms(res.data.data.rooms || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, [filter]);

  const handleAction = async () => {
    setSubmitting(true);
    try {
      await api.patch(`/admin/rooms/${modal.room.id}/status`, { status: modal.action, adminNote: note });
      toast.success(`Room ${modal.action}`);
      setModal(null); setNote('');
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const filterBtns = [
    { value: 'pending',  label: 'Pending',  color: '#b45309' },
    { value: 'active',   label: 'Active',   color: '#15803d' },
    { value: 'rejected', label: 'Rejected', color: '#b91c1c' },
    { value: 'removed',  label: 'Removed',  color: 'var(--gray-500)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaHome style={{ color: 'var(--primary)' }} /> Rooms
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: '4px 0 0' }}>{rooms.length} {filter} listing{rooms.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {filterBtns.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`btn btn-sm ${filter === f.value ? 'btn-primary' : 'btn-ghost'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size="lg" /></div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <FaHome className="empty-state-icon" />
          <p className="empty-state-title">No {filter} rooms</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rooms.map(room => {
            const images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images || [];
            const statusColors = { active: { bg: '#dcfce7', color: '#15803d' }, pending: { bg: '#fef9c3', color: '#854d0e' }, rejected: { bg: '#fee2e2', color: '#b91c1c' }, removed: { bg: 'var(--gray-100)', color: 'var(--gray-500)' } }[room.status] || {};
            return (
              <div key={room.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '110px', flexShrink: 0, background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', minHeight: '90px' }}>
                  {images[0] ? <img src={images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <FaImage style={{ fontSize: '24px' }} />}
                </div>
                <div style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 700, color: 'var(--gray-900)', margin: 0, fontSize: '14px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '260px' }}>{room.title}</p>
                      <span style={{ ...statusColors, padding: '3px 9px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{room.status}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 2px' }}>
                      <FaMapMarkerAlt style={{ color: 'var(--primary)', fontSize: '10px' }} />{room.location} · <span style={{ textTransform: 'capitalize' }}>{room.room_type}</span>
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{formatPrice(room.price)}/mo</p>
                    <p style={{ fontSize: '11px', color: 'var(--gray-400)', margin: '2px 0 0' }}>By {room.landlord_name} · {formatDate(room.created_at)}</p>
                    {room.admin_note && <p style={{ fontSize: '11px', color: '#b45309', fontStyle: 'italic', margin: '4px 0 0' }}>Note: {room.admin_note}</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    <Link to={`/rooms/${room.id}`} target="_blank" className="btn btn-ghost btn-sm">
                      <FaEye style={{ fontSize: '12px' }} />View
                    </Link>
                    {room.status === 'pending' && (
                      <>
                        <button onClick={() => setModal({ room, action: 'active' })}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>
                          <FaCheckCircle style={{ fontSize: '11px' }} />Approve
                        </button>
                        <button onClick={() => setModal({ room, action: 'rejected' })}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>
                          <FaTimesCircle style={{ fontSize: '11px' }} />Reject
                        </button>
                      </>
                    )}
                    {room.status === 'active' && (
                      <button onClick={() => setModal({ room, action: 'removed' })}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: 'var(--gray-100)', color: 'var(--gray-700)' }}>
                        <FaTrash style={{ fontSize: '11px' }} />Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <p className="modal-title">{modal.action === 'active' ? 'Approve' : modal.action === 'rejected' ? 'Reject' : 'Remove'} Room</p>
              <button onClick={() => setModal(null)} className="modal-close"><FaTimes /></button>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--gray-700)', marginBottom: '16px', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{modal.room.title}</p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px' }}>Admin note (optional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="input" placeholder="Add a note..." />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleAction} disabled={submitting}
                className={`btn ${modal.action === 'active' ? 'btn-primary' : 'btn-danger'}`} style={{ flex: 1 }}>
                {submitting ? 'Processing...' : 'Confirm'}
              </button>
              <button onClick={() => setModal(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;