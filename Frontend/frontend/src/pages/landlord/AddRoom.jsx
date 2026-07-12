import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import RoomForm from '../../components/room/RoomForm.jsx';
import { createRoom } from '../../services/roomService.js';
import toast from 'react-hot-toast';

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await createRoom(formData);
      toast.success('Room submitted for admin review!');
      navigate('/landlord/my-rooms');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaPlusCircle style={{ color: 'var(--primary)' }} /> Add New Room
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: '6px 0 0' }}>Fill in the details below. Your listing will be reviewed before going live.</p>
      </div>
      <div className="card">
        <RoomForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default AddRoom;