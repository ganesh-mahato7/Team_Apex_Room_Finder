import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLandlordRooms } from '../../services/roomService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { STATUS_COLORS, VERIFICATION_STATUS } from '../../utils/constants.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLandlordRooms()
      .then(res => setRooms(res.data.data.rooms))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: rooms.length,
    active: rooms.filter(r => r.status === 'active').length,
    pending: rooms.filter(r => r.status === 'pending').length,
    rejected: rooms.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 warm-bg" style={{ minHeight: '100vh', padding: '28px', margin: '-28px' }}>
      <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Landlord Dashboard</h1>

      {user?.verification_status !== VERIFICATION_STATUS.APPROVED && (
        <div
          className="px-4 py-3 rounded-lg text-sm font-medium border"
          style={
            user?.verification_status === VERIFICATION_STATUS.PENDING
              ? { background: '#FEF3D9', color: '#8A5A0A', borderColor: '#F3DDA0' }
              : { background: '#FBE9E5', color: '#9A2E1D', borderColor: '#F0C7BC' }
          }
        >
          {user?.verification_status === VERIFICATION_STATUS.PENDING
            ? '⏳ Your account is pending verification. You cannot post rooms yet.'
            : user?.verification_status === VERIFICATION_STATUS.REJECTED
              ? '❌ Verification rejected. Resubmit documents in Profile.'
              : '⚠️ Submit verification documents to start posting rooms.'}
          {' '}<Link to="/user/profile" className="underline font-semibold" style={{ color: 'inherit' }}>Go to Profile →</Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Rooms', value: stats.total, color: 'var(--text)' },
          { label: 'Active', value: stats.active, color: '#6B7F5E' },
          { label: 'Pending Review', value: stats.pending, color: '#B45309' },
          { label: 'Rejected', value: stats.rejected, color: '#C1442E' },
        ].map(s => (
          <div
            key={s.label}
            className="text-center"
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '22px',
              boxShadow: '0 2px 10px rgba(61,43,31,0.05)',
            }}
          >
            <p className="font-display text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/landlord/add-room" className="btn btn-primary">+ Add New Room</Link>
        <Link
          to="/landlord/my-rooms"
          className="btn"
          style={{ background: 'var(--white)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          View All Rooms
        </Link>
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '26px 28px' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Recent Rooms</h2>
        {loading ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading...</p>
        ) : rooms.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            No rooms yet. <Link to="/landlord/add-room" style={{ color: 'var(--primary)', fontWeight: 600 }}>Add your first room</Link>
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {rooms.slice(0, 5).map(room => (
              <div key={room.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium line-clamp-1" style={{ color: 'var(--text)' }}>{room.title}</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{room.location}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`badge ${STATUS_COLORS[room.status] || ''}`}>{room.status}</span>
                  <Link to={`/landlord/edit-room/${room.id}`} className="text-sm" style={{ color: 'var(--primary)', fontWeight: 600 }}>Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;