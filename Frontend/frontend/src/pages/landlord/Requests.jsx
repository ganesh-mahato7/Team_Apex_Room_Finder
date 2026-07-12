import { useEffect, useState } from 'react';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import { getLandlordBookingRequests, respondToBookingRequest } from '../../services/bookingService.js';
import { formatPrice, formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader.jsx';

const COLORS = {
  primary: '#C9662D', text: '#3D2B1F', muted: '#8A7B6C', border: '#E8DCC8', bg: '#FAF3E7', white: '#FFFFFF',
};

const STATUS_STYLE = {
  pending:   { bg: '#FEF3D9', color: '#B45309', label: 'Pending' },
  accepted:  { bg: '#E5EADF', color: '#566B4A', label: 'Accepted' },
  rejected:  { bg: '#FBE9E5', color: '#C1442E', label: 'Rejected' },
  cancelled: { bg: '#F3E9D8', color: '#8A7B6C', label: 'Cancelled' },
};

const LandlordRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [respondingId, setRespondingId] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    getLandlordBookingRequests()
      .then(res => setRequests(res.data.data.bookings))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleRespond = async (id, status) => {
    setRespondingId(id);
    try {
      await respondToBookingRequest(id, status);
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setRespondingId(null); }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: COLORS.text, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaClipboardList style={{ color: COLORS.primary }} /> Booking Requests
          </h1>
          <p style={{ fontSize: '13px', color: COLORS.muted, margin: '4px 0 0' }}>
            {pendingCount > 0 ? `${pendingCount} awaiting your response` : 'All caught up'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['pending', 'accepted', 'rejected', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize',
                border: filter === f ? 'none' : `1px solid ${COLORS.border}`,
                background: filter === f ? COLORS.primary : COLORS.white,
                color: filter === f ? COLORS.white : COLORS.muted,
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <FaClipboardList style={{ fontSize: '32px', color: COLORS.border, marginBottom: '10px' }} />
          <p style={{ color: COLORS.muted, fontSize: '14px' }}>No {filter !== 'all' ? filter : ''} requests</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(r => {
            const s = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
            return (
              <div key={r.id} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '260px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#C9662D,#A8511F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                      {r.user_name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                        <p style={{ fontWeight: 700, color: COLORS.text, margin: 0, fontSize: '14px' }}>{r.user_name}</p>
                        <span style={{ background: s.bg, color: s.color, padding: '2px 9px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: COLORS.text, margin: '4px 0', fontWeight: 600 }}>{r.room_title}</p>
                      <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaMapMarkerAlt style={{ fontSize: '10px' }} />{r.room_location} · {formatPrice(r.room_price)}/mo
                      </p>
                      {r.message && (
                        <p style={{ fontSize: '13px', color: COLORS.text, background: COLORS.bg, borderRadius: '8px', padding: '8px 10px', marginTop: '8px', fontStyle: 'italic' }}>
                          "{r.message}"
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '14px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaEnvelope style={{ fontSize: '10px' }} />{r.user_email}
                        </span>
                        {r.user_phone && (
                          <span style={{ fontSize: '12px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaPhone style={{ fontSize: '10px' }} />{r.user_phone}
                          </span>
                        )}
                        <span style={{ fontSize: '12px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaClock style={{ fontSize: '10px' }} />{formatDate(r.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleRespond(r.id, 'accepted')}
                        disabled={respondingId === r.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#E5EADF', color: '#566B4A', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                      >
                        <FaCheckCircle style={{ fontSize: '12px' }} />Accept
                      </button>
                      <button
                        onClick={() => handleRespond(r.id, 'rejected')}
                        disabled={respondingId === r.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#FBE9E5', color: '#C1442E', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                      >
                        <FaTimesCircle style={{ fontSize: '12px' }} />Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandlordRequests;