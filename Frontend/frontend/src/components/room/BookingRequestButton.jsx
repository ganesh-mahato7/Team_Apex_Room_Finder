import { useState } from 'react';
import { FaCalendarCheck, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { createBookingRequest } from '../../services/bookingService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const COLORS = {
  primary: '#C9662D',
  primaryDark: '#A8511F',
  text: '#3D2B1F',
  muted: '#8A7B6C',
  border: '#E8DCC8',
  bg: '#FAF3E7',
  white: '#FFFFFF',
};

// Usage: <BookingRequestButton roomId={room.id} />
// Only renders for logged-in 'user' role accounts — landlords/admins won't see it.
const BookingRequestButton = ({ roomId }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.role !== 'user') return null;

  const handleSend = async () => {
    setSending(true);
    try {
      await createBookingRequest(roomId, message.trim());
      toast.success('Booking request sent!');
      setSent(true);
      setTimeout(() => setOpen(false), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setSent(false); setMessage(''); }}
        className="btn btn-primary btn-full"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <FaCalendarCheck /> Request to Book
      </button>

      {open && (
        <div
          onClick={() => !sending && setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,31,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: COLORS.white, borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', border: `1px solid ${COLORS.border}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: COLORS.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarCheck style={{ color: COLORS.primary }} /> Request to Book
              </h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, fontSize: '16px' }}>
                <FaTimes />
              </button>
            </div>

            {sent ? (
              <p style={{ color: '#566B4A', fontSize: '14px', fontWeight: 600, textAlign: 'center', padding: '20px 0' }}>
                ✓ Request sent — the landlord will be notified.
              </p>
            ) : (
              <>
                <p style={{ fontSize: '13px', color: COLORS.muted, marginBottom: '12px' }}>
                  Send a short note to the landlord with your request (optional).
                </p>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="e.g. I'd like to move in from next month..."
                  style={{ width: '100%', border: `1.5px solid ${COLORS.border}`, borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: COLORS.text, resize: 'vertical', marginBottom: '16px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = COLORS.primary}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                />
                <button
                  onClick={handleSend}
                  disabled={sending}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: COLORS.primary, color: COLORS.white, fontWeight: 700, fontSize: '14px', cursor: sending ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <FaPaperPlane style={{ fontSize: '12px' }} /> {sending ? 'Sending...' : 'Send Request'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookingRequestButton;