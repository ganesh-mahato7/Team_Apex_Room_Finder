import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { getFavorites } from '../../services/roomService.js';
import RoomList from '../../components/room/RoomList.jsx';

const Favorites = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then(res => setRooms(res.data.data.rooms))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHeart style={{ color: '#ef4444' }} /> Saved Rooms
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--gray-500)', margin: '6px 0 0' }}>{rooms.length} saved listing{rooms.length !== 1 ? 's' : ''}</p>
      </div>
      <RoomList rooms={rooms} loading={loading} />
    </div>
  );
};

export default Favorites;