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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">

        {/* Images */}
        <div className="rounded-xl overflow-hidden bg-gray-100 mb-6">
          {images.length > 0 ? (
            <>
              <img src={images[imgIndex]} alt={room.title} className="w-full h-96 object-cover" />
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <img key={i} src={img} onClick={() => setImgIndex(i)}
                      className={`h-16 w-24 object-cover rounded-lg cursor-pointer border-2 transition ${i === imgIndex ? 'border-blue-600' : 'border-transparent'}`} />
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
                <h1 className="text-2xl font-bold text-gray-900">{room.title}</h1>
                <span className="badge bg-blue-100 text-blue-800 shrink-0 capitalize">{room.room_type}</span>
              </div>
              <p className="text-gray-500 mt-1">📍 {room.address}</p>
              <p className="text-sm text-gray-400 mt-1">Listed {formatDate(room.created_at)}</p>
            </div>

            <div className="card">
              <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{room.description}</p>
            </div>

            {amenities.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {rules.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-3">House Rules</h2>
                <ul className="space-y-1">
                  {rules.map((r, i) => (
                    <li key={i} className="text-gray-600 text-sm flex gap-2"><span>•</span>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card">
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(room.price)}<span className="text-base font-normal text-gray-500">/mo</span>
              </p>
              <p className="text-sm mt-2 text-gray-500">
                Landlord: <span className="font-medium text-gray-800">{room.landlord_name}</span>
              </p>
              {room.landlord_phone && <p className="text-sm text-gray-500">📞 {room.landlord_phone}</p>}
              <div className="mt-4 space-y-2">
                {user?.role === 'user' && (
                  <>
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
                <p className="text-sm font-medium text-gray-700 mb-2">Something wrong with this listing?</p>
                <button onClick={() => setReportModal(true)} className="text-sm text-red-500 hover:underline">
                  🚩 Report this room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black\/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-900 mb-3">Report this Room</h3>
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