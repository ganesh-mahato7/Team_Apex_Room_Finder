import { useNavigate } from "react-router-dom";

const Header = ({ notifCount = 0, messageCount = 4, userName = "Ram Sharma", userRole = "Room Seeker" }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle">☰</button>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search for rooms, apartments, locations..." />
        </div>
      </div>

      <div className="header-right">

        {/* Bell — goes to /notifications */}
        <button
          className="header-btn notif-btn"
          onClick={() => navigate("/notifications")}
          title="Notifications"
        >
          🔔
          {notifCount > 0 && <span className="notif-dot" />}
        </button>

        {/* Message — goes to /messages */}
        <button
          className="header-btn msg-btn"
          onClick={() => navigate("/messages")}
          title="Messages"
        >
          💬
          {messageCount > 0 && (
            <span className="message-count">{messageCount}</span>
          )}
        </button>

        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;