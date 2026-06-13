// pages/User/UserBookmarks.jsx

import { useNavigate } from "react-router-dom";
import { FiBookmark, FiSearch } from "react-icons/fi";
import { RoomCard } from "./DashboardOverview";

export default function UserBookmarks({ bookmarkData }) {
  const navigate = useNavigate();
  const { bookmarks, loading, error, toggleBookmark } = bookmarkData;

  const bookmarkedIds = new Set(bookmarks.map((b) => b.id));

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="ud-empty">
        <h3>Failed to load bookmarks</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="ud-empty">
        <FiBookmark size={44} />
        <h3>No saved rooms yet</h3>
        <p>Browse listings and tap the bookmark icon to save rooms you like.</p>
        <button className="btn-primary" onClick={() => navigate("/rooms")}>
          <FiSearch size={14} /> Browse Rooms
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="rooms-result-info" style={{ marginBottom: 16 }}>
        {bookmarks.length} saved room{bookmarks.length !== 1 ? "s" : ""}
      </p>
      <div className="ud-rooms-grid">
        {bookmarks.map((room) => (
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
  );
}