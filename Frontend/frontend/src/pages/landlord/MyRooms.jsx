import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaEdit, FaTrash, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { getLandlordRooms, deleteRoom } from '../../services/roomService.js';
import Loader from '../../components/common/Loader.jsx';
import { formatPrice } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchRooms = () => {
    setLoading(true);
    getLandlordRooms()
      .then(res => setRooms(res.data.data.rooms))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteRoom(id);
      toast.success('Room deleted');
      fetchRooms();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const statusStyle = {
    active:   { bg: '#dcfce7', color: '#15803d' },
    pending:  { bg: '#fef9c3', color: '#854d0e' },
    rejected: { bg: '#fee2e2', color: '#b91c1c' },
    removed:  { bg: 'var(--gray-100)', color: 'var(--gray-500)' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaHome style={{ color: 'var(--primary)' }} /> My Rooms
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: '4px 0 0' }}>{rooms.length} listing{rooms.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/landlord/add-room" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <FaPlusCircle /> Add Room
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size="lg" /></div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <FaHome className="empty-state-icon" />
          <p className="empty-state-title">No rooms yet</p>
          <p className="empty-state-desc">Add your first listing and start getting inquiries</p>
          <Link to="/landlord/add-room" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>+ Add Room</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rooms.map(room => {
            const images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images || [];
            const s = statusStyle[room.status] || statusStyle.removed;
            return (
              <div key={room.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '130px', flexShrink: 0, background: 'var(--gray-100)', position: 'relative' }}>
                  {images[0] ? (
                    <img src={images[0]} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '100px' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>
                      <FaHome style={{ fontSize: '24px' }} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 700, color: 'var(--gray-900)', margin: 0, fontSize: '15px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '300px' }}>{room.title}</p>
                      <span style={{ ...s, padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize', flexShrink: 0 }}>{room.status}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 0 4px' }}>
                      <FaMapMarkerAlt style={{ color: 'var(--primary)', fontSize: '11px' }} />{room.location}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                      {formatPrice(room.price)}<span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--gray-400)' }}>/mo</span>
                    </p>
                    {room.admin_note && (
                      <p style={{ fontSize: '12px', color: '#b45309', background: '#fffbeb', padding: '4px 10px', borderRadius: '6px', marginTop: '6px', display: 'inline-block' }}>
                        Note: {room.admin_note}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <Link to={`/rooms/${room.id}`} className="btn btn-ghost btn-sm" title="View">
                      <FaEye style={{ fontSize: '13px' }} />
                    </Link>
                    <Link to={`/landlord/edit-room/${room.id}`} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaEdit style={{ fontSize: '13px' }} /> Edit
                    </Link>
                    <button onClick={() => handleDelete(room.id, room.title)} disabled={deleting === room.id}
                      className="btn btn-sm" style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaTrash style={{ fontSize: '12px' }} />
                      {deleting === room.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRooms;