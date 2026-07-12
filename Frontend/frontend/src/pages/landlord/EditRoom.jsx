import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import RoomForm from '../../components/room/RoomForm.jsx';
import { getRoomById, updateRoom } from '../../services/roomService.js';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader.jsx';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getRoomById(id)
      .then(res => setRoom(res.data.data.room))
      .catch(() => toast.error('Room not found'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const body = {};
      for (let [k, v] of formData.entries()) body[k] = v;
      await updateRoom(id, body);
      toast.success('Room updated successfully');
      navigate('/landlord/my-rooms');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  if (fetching) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size="lg" /></div>;
  if (!room) return (
    <div className="empty-state">
      <p className="empty-state-title">Room not found</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaEdit style={{ color: 'var(--primary)' }} /> Edit Room
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: '6px 0 0' }}>Update your listing details below.</p>
      </div>
      <div className="card">
        <RoomForm initialData={room} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default EditRoom;