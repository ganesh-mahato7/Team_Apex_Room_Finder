// pages/User/DashboardOverview.jsx

import { useNavigate } from "react-router-dom";
import { FiBookmark, FiSearch, FiMapPin, FiHome } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { toggleBookmarkApi } from "../../scripts/api";

const TYPE_ICON = {
  room:      <FiHome size={28} />,
  apartment: <MdApartment size={28} />,
  flat:      <FiHome size={28} />,
};

function RoomCard({ room, bookmarkedIds, onBookmark, onClick }) {
  const facilities = Array.isArray(room.facilities)
    ? room.facilities
    : JSON.parse(room.facilities || "[]");

  const images = Array.isArray(room.images)
    ? room.images
    : JSON.parse(room.images || "[]");

  const isSaved = bookmarkedIds?.has(room.id);

  return (
    <div className="ud-room-card" onClick={onClick}>
      <div className="ud-room-img">
        {images[0]
          ? <img src={images[0]} alt={room.title} />
          : TYPE_ICON[room.type] || <FiHome size={28} />
        }
        <span className="ud-room-type-badge">{room.type}</span>
        {onBookmark && (
          <button
            className={`ud-bookmark-btn ${isSaved ? "saved" : ""}`}
            onClick={(e) => { e.stopPropagation(); onBookmark(room.id); }}
            title={isSaved ? "Remove bookmark" : "Save room"}
          >
            <FiBookmark size={14} fill={isSaved ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="ud-room-info">
        <div className="ud-room-title">{room.title}</div>
        <div className="ud-room-location">
          <FiMapPin size={11} />
          {room.location}
        </div>
        {facilities.length > 0 && (
          <div className="ud-facility-pills">
            {facilities.slice(0, 3).map((f) => (
              <span key={f} className="ud-facility-pill">{f}</span>
            ))}
            {facilities.length > 3 && (
              <span className="ud-facility-pill">+{facilities.length - 3}</span>
            )}
          </div>
        )}
        <div className="ud-room-footer">
          <div className="ud-room-rent">
            NPR {Number(room.rent).toLocaleString()}
            <span>/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview({ profileData, bookmarkData, overviewData, onTabChange }) {
  const navigate = useNavigate();
  const { stats }         = profileData;
  const { bookmarks, toggleBookmark } = bookmarkData;
  const { recentRooms, loading }      = overviewData;

  // Build a Set of bookmarked IDs from bookmarks array
  const bookmarkedIds = new Set(bookmarks.map((b) => b.id));

  return (
    <>
      {/* Stats */}
      <div className="ud-stats-grid">
        <div className="ud-stat-card">
          <div className="ud-stat-icon" style={{ background: "#e8f1ff", color: "#2b7fff" }}>
            <FiBookmark size={20} />
          </div>
          <div>
            <h3>{stats?.savedRooms ?? bookmarks.length}</h3>
            <p>Saved Rooms</p>
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-icon" style={{ background: "#e8f4ee", color: "#38a169" }}>
            <FiSearch size={20} />
          </div>
          <div>
            <h3>Browse</h3>
            <p>Find Rooms</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="ud-section-header" style={{ marginBottom: 12 }}>
        <h2>Quick Actions</h2>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => navigate("/rooms")}>
          <FiSearch size={14} /> Browse All Rooms
        </button>
        <button className="btn-outline" onClick={() => onTabChange("bookmarks")}>
          <FiBookmark size={14} /> View Saved ({bookmarks.length})
        </button>
      </div>

      {/* Saved rooms preview */}
      {bookmarks.length > 0 && (
        <>
          <div className="ud-section-header">
            <h2>Recently Saved</h2>
            <button className="ud-view-all" onClick={() => onTabChange("bookmarks")}>
              View all →
            </button>
          </div>
          <div className="ud-rooms-grid" style={{ marginBottom: 32 }}>
            {bookmarks.slice(0, 3).map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                bookmarkedIds={bookmarkedIds}
                onBookmark={toggleBookmark}
                onClick={() => navigate(`/rooms/${room.id}`)}
              />
            ))}
          </div>
        </>
      )}

      {/* Latest listings */}
      <div className="ud-section-header">
        <h2>Latest Listings</h2>
        <button className="ud-view-all" onClick={() => navigate("/rooms")}>
          Browse all →
        </button>
      </div>

      {loading ? (
        <div className="ud-rooms-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ud-room-card">
              <div className="ud-skeleton" style={{ height: 160 }} />
              <div style={{ padding: 14 }}>
                <div className="ud-skeleton" style={{ height: 14, marginBottom: 8, borderRadius: 6 }} />
                <div className="ud-skeleton" style={{ height: 12, width: "60%", borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : recentRooms.length === 0 ? (
        <div className="ud-empty">
          <FiHome size={40} />
          <h3>No listings yet</h3>
          <p>Check back soon — new rooms are added daily.</p>
        </div>
      ) : (
        <div className="ud-rooms-grid">
          {recentRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              bookmarkedIds={bookmarkedIds}
              onBookmark={toggleBookmark}
              onClick={() => navigate(`/rooms/${room.id}`)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export { RoomCard };