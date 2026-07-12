import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, toggleFavorite, submitReport } from '../../services/roomService.js';
import { startChat } from '../../services/chatService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatPrice, formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';
import BookingRequestButton from '../../components/room/BookingRequestButton.jsx';

const RoomDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    getRoomById(id)
      .then(res => setRoom(res.data.data.room))
      .catch(() => toast.error('Room not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavorite = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await toggleFavorite(id);
      toast.success(res.data.message);
    } catch { toast.error('Failed'); }
  };

  const handleChat = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'user') return toast.error('Only users can initiate chat');
    try {
      const res = await startChat({ landlordId: room.landlord_id, roomId: room.id });
      navigate('/chats', { state: { chatId: res.data.data.chat.id } });
    } catch { toast.error('Could not start chat'); }
  };

  const handleReport = async () => {
    if (!user) return navigate('/login');
    if (!reportReason.trim()) return toast.error('Please provide a reason');
    try {
      await submitReport({ roomId: id, reason: reportReason });
      toast.success('Report submitted');
      setReportModal(false);
      setReportReason('');
    } catch { toast.error('Failed to submit report'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="lg" /></div>;
  if (!room) return <div className="min-h-screen flex items-center justify-center text-gray-400">Room not found</div>;

  const images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images || [];
  const amenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities || [];
  const rules = typeof room.rules === 'string' ? JSON.parse(room.rules) : room.rules || [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg, #FAF3E7)' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">

        {/* Images */}
        <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'var(--white, #fff)', border: '1px solid var(--border, #E8DCC8)' }}>
          {images.length > 0 ? (
            <>
              <img src={images[imgIndex]} alt={room.title} className="w-full h-96 object-cover" />
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setImgIndex(i)}
                      className="h-16 w-24 object-cover rounded-lg cursor-pointer transition"
                      style={{ border: `2px solid ${i === imgIndex ? 'var(--primary, #C9662D)' : 'transparent'}` }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">No images available</div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text, #3D2B1F)' }}>{room.title}</h1>
                <span
                  className="shrink-0 capitalize"
                  style={{ background: '#FBF0E8', color: '#A8511F', padding: '3px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700 }}
                >
                  {room.room_type}
                </span>
              </div>
              <p className="mt-1" style={{ color: 'var(--muted, #8A7B6C)' }}>📍 {room.address}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted, #8A7B6C)' }}>Listed {formatDate(room.created_at)}</p>
            </div>

            <div className="card">
              <h2 className="font-semibold mb-2" style={{ color: 'var(--text, #3D2B1F)' }}>Description</h2>
              <p className="leading-relaxed" style={{ color: 'var(--muted, #8A7B6C)' }}>{room.description}</p>
            </div>

            {amenities.length > 0 && (
              <div className="card">
                <h2 className="font-semibold mb-3" style={{ color: 'var(--text, #3D2B1F)' }}>Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ background: '#E5EADF', color: '#566B4A' }}>✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {rules.length > 0 && (
              <div className="card">
                <h2 className="font-semibold mb-3" style={{ color: 'var(--text, #3D2B1F)' }}>House Rules</h2>
                <ul className="space-y-1">
                  {rules.map((r, i) => (
                    <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--muted, #8A7B6C)' }}><span>•</span>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card">
              <p className="text-3xl font-bold" style={{ color: 'var(--primary, #C9662D)' }}>
                {formatPrice(room.price)}<span className="text-base font-normal" style={{ color: 'var(--muted, #8A7B6C)' }}>/mo</span>
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--muted, #8A7B6C)' }}>
                Landlord: <span className="font-medium" style={{ color: 'var(--text, #3D2B1F)' }}>{room.landlord_name}</span>
              </p>
              {room.landlord_phone && <p className="text-sm" style={{ color: 'var(--muted, #8A7B6C)' }}>📞 {room.landlord_phone}</p>}

              <div className="mt-4 space-y-2">
                {user?.role === 'user' && (
                  <>
                    <BookingRequestButton roomId={room.id} />
                    <button onClick={handleChat} className="btn btn-primary btn-full">💬 Chat with Landlord</button>
                    <button onClick={handleFavorite} className="btn btn-secondary btn-full">♡ Save to Favorites</button>
                  </>
                )}
                {!user && (
                  <button onClick={() => navigate('/login')} className="btn btn-primary btn-full">Login to Contact</button>
                )}
              </div>
            </div>

            {user && (
              <div className="card">
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text, #3D2B1F)' }}>Something wrong with this listing?</p>
                <button onClick={() => setReportModal(true)} className="text-sm hover:underline" style={{ color: '#C1442E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  🚩 Report this room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report modal */}
      {reportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background: 'rgba(61,43,31,0.5)' }}>
          <div className="rounded-xl p-6 w-full max-w-md" style={{ background: 'var(--white, #fff)' }}>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text, #3D2B1F)' }}>Report this Room</h3>
            <textarea value={reportReason} onChange={e => setReportReason(e.target.value)}
              rows={4} className="input mb-4" placeholder="Describe the issue..." />
            <div className="flex gap-2">
              <button onClick={handleReport} className="btn btn-danger flex-1">Submit Report</button>
              <button onClick={() => setReportModal(false)} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RoomDetails;