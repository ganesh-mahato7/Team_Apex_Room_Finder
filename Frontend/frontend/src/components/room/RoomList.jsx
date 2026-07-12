import RoomCard from './RoomCard.jsx';
import Loader from '../common/Loader.jsx';

const RoomList = ({ rooms, loading, showStatus, cardActions }) => {
  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" text="Loading rooms..." /></div>;
  if (!rooms?.length) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-lg">No rooms found</p>
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} showStatus={showStatus} actions={cardActions?.(room)} />
      ))}
    </div>
  );
};

export default RoomList;