import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaMapMarkerAlt, FaClock, FaTimes } from 'react-icons/fa';
import { getMyBookingRequests, cancelBookingRequest } from '../../services/bookingService.js';
import { formatPrice, formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader.jsx';

const COLORS = { primary: '#C9662D', text: '#3D2B1F', muted: '#8A7B6C', border: '#E8DCC8', bg: '#FAF3E7', white: '#FFFFFF' };

const STATUS_STYLE = {
  pending:   { bg: '#FEF3D9', color: '#B45309', label: 'Pending' },
  accepted:  { bg: '#E5EADF', color: '#566B4A', label: 'Accepted' },
  rejected:  { bg: '#FBE9E5', color: '#C1442E', label: 'Rejected' },
  cancelled: { bg: '#F3E9D8', color: '#8A7B6C', label: 'Cancelled' },
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    getMyBookingRequests()
      .then(res => setRequests(res.data.data.bookings))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this request?')) return;
    setCancellingId(id);
    try {
      await cancelBookingRequest(id);
      toast.success('Request cancelled');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setCancellingId(null); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: COLORS.text, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaClipboardList style={{ color: COLORS.primary }} /> My Requests
        </h1>
        <p style={{ fontSize: '13px', color: COLORS.muted, margin: '4px 0 0' }}>Track the booking requests you've sent</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size="lg" /></div>
      ) : requests.length === 0 ? (
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <FaClipboardList style={{ fontSize: '32px', color: COLORS.border, marginBottom: '10px' }} />
          <p style={{ color: COLORS.muted, fontSize: '14px' }}>
            No requests yet. <Link to="/" style={{ color: COLORS.primary, fontWeight: 600 }}>Browse rooms</Link> to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {requests.map(r => {
            const s = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
            return (
              <div key={r.id} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontWeight: 700, color: COLORS.text, margin: 0, fontSize: '14px' }}>{r.room_title}</p>
                    <span style={{ background: s.bg, color: s.color, padding: '2px 9px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaMapMarkerAlt style={{ fontSize: '10px' }} />{r.room_location} · {formatPrice(r.room_price)}/mo · by {r.landlord_name}
                  </p>
                  <p style={{ fontSize: '12px', color: COLORS.muted, margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaClock style={{ fontSize: '10px' }} />Sent {formatDate(r.created_at)}
                  </p>
                </div>
                {r.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    disabled={cancellingId === r.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.muted, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <FaTimes style={{ fontSize: '10px' }} />Cancel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRequests;