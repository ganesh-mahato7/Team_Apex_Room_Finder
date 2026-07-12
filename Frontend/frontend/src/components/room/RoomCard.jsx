import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaHeart, FaRegHeart, FaUser, FaTag } from 'react-icons/fa';
import { formatPrice } from '../../utils/helpers.js';
import { STATUS_COLORS } from '../../utils/constants.js';

const RoomCard = ({ room, showStatus = false, actions, onFavorite, isFavorited }) => {
  const images    = typeof room.images    === 'string' ? JSON.parse(room.images)    : room.images    || [];
  const amenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities || [];

  return (
    <div className="room-card">
      <Link to={`/rooms/${room.id}`}>
        <div className="room-card-image">
          {images[0]
            ? <img src={images[0]} alt={room.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#9ca3af', fontSize:'13px' }}>
                <FaBed style={{ marginRight:'6px', fontSize:'20px' }} />No image
              </div>
          }
        </div>
      </Link>
      <div className="room-card-body">
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px' }}>
          <Link to={`/rooms/${room.id}`} style={{ fontWeight:600, color:'#111827', flex:1, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical' }}>
            {room.title}
          </Link>
          {showStatus && (
            <span className={`badge ${STATUS_COLORS[room.status] || 'bg-gray-100 text-gray-700'}`} style={{ flexShrink:0 }}>
              {room.status}
            </span>
          )}
          {onFavorite && (
            <button onClick={onFavorite} style={{ background:'none', border:'none', cursor:'pointer', color: isFavorited ? '#e53e3e' : '#9ca3af', fontSize:'18px', padding:0, flexShrink:0 }}>
              {isFavorited ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>
        <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
          <FaMapMarkerAlt style={{ color:'#3b82f6', flexShrink:0 }} />{room.location}
        </p>
        <p style={{ fontSize:'13px', color:'#6b7280', display:'flex', alignItems:'center', gap:'4px' }}>
          <FaTag style={{ color:'#3b82f6', flexShrink:0 }} />
          <span style={{ textTransform:'capitalize' }}>{room.room_type}</span>
        </p>
        {amenities.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'8px' }}>
            {amenities.slice(0, 3).map((a, i) => (
              <span key={i} style={{ fontSize:'11px', background:'#eff6ff', color:'#1d4ed8', padding:'2px 8px', borderRadius:'9999px' }}>{a}</span>
            ))}
            {amenities.length > 3 && <span style={{ fontSize:'11px', color:'#9ca3af' }}>+{amenities.length - 3} more</span>}
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'12px' }}>
          <span style={{ fontWeight:700, color:'#2563eb' }}>
            {formatPrice(room.price)}<span style={{ fontWeight:400, fontSize:'12px', color:'#6b7280' }}>/mo</span>
          </span>
          {room.landlord_name && (
            <span style={{ fontSize:'12px', color:'#9ca3af', display:'flex', alignItems:'center', gap:'3px' }}>
              <FaUser style={{ fontSize:'10px' }} />{room.landlord_name}
            </span>
          )}
        </div>
        {actions && <div style={{ marginTop:'12px', display:'flex', gap:'8px' }}>{actions}</div>}
      </div>
    </div>
  );
};

export default RoomCard;