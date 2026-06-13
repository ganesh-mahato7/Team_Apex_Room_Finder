import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { section: "MAIN",        items: [{ label: "Dashboard", href: "/dashboard" }, { label: "Search Rooms", href: "/search" }] },
  { section: "MY ACTIVITY", items: [{ label: "Saved Listings", href: "/saved-listing", badge: "8" }, { label: "Recently Viewed", href: "/recently-viewed" }] },
  { section: "BOOKINGS",    items: [{ label: "My Bookings", href: "/my-bookings", badge: "3" }, { label: "Scheduled Visits", href: "/upcoming-visit", badge: "2", badgeClass: "warning" }, { label: "Booking History", href: "/booking-history" }] },
  { section: "PAYMENTS",    items: [{ label: "Payment History", href: "/payment-history" }, { label: "Rent Payments", href: "/rent-payments" }] },
  { section: "ACCOUNT",     items: [{ label: "My Profile", href: "/profile" }, { label: "Settings", href: "/settings" }] },
];

const chatThreads = [
  { initials: "KR", name: "Krishna Rai",  preview: "Hi! Are you still interested?",     time: "2h",  unread: true  },
  { initials: "ST", name: "Sita Thapa",   preview: "The flat is available from 15th...", time: "1d",  unread: false },
  { initials: "RM", name: "Ramesh Magar", preview: "Thank you for booking!",             time: "Mar", unread: false },
];

const Layout = ({ children, notifCount = 3, messageCount = 4 }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen]   = useState(false);
  const [chatOpen, setChatOpen]         = useState(false);
  const [activeThread, setActiveThread] = useState(null);
  const [chatMessage, setChatMessage]   = useState("");

  const handleNavClick = (href) => {
    setProfileOpen(false);
    navigate(href);
  };

  return (
    <div className="layout-root">

      {/* ── Overlay ── */}
      {profileOpen && (
        <div className="overlay" onClick={() => setProfileOpen(false)} />
      )}

      {/* ── Profile Sliding Sidebar ── */}
      <aside className={`profile-sidebar ${profileOpen ? "open" : ""}`}>
        <div className="ps-header">
          <div className="ps-avatar">👤</div>
          <div className="ps-info">
            <span className="ps-name">Ram Sharma</span>
            <span className="ps-role">Room Seeker</span>
          </div>
          <button className="ps-close" onClick={() => setProfileOpen(false)}>✕</button>
        </div>

        <nav className="ps-nav">
          {navLinks.map(({ section, items }) => (
            <div className="ps-section" key={section}>
              <span className="ps-section-title">{section}</span>
              {items.map(({ label, href, badge, badgeClass }) => (
                <button
                  key={label}
                  className={`ps-nav-item ${window.location.pathname === href ? "active" : ""}`}
                  onClick={() => handleNavClick(href)}
                >
                  {label}
                  {badge && <span className={`badge ${badgeClass || ""}`}>{badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="ps-footer">
          <button className="ps-logout" onClick={() => navigate("/")}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main Wrapper ── */}
      <div className="layout-main">

        {/* ── Header ── */}
        <header className="header">
          <div className="header-left">
            <div className="logo-inline" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
              <div className="logo-icon">🏠</div>
              <span className="logo-text">RoomFinder</span>
            </div>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search for rooms, apartments, locations..." />
            </div>
          </div>

          <div className="header-right">
            <button
              className="header-btn notif-btn"
              onClick={() => navigate("/notifications")}
              title="Notifications"
            >
              🔔
              {notifCount > 0 && <span className="notif-dot" />}
            </button>

            <div
              className="user-profile-btn"
              onClick={() => setProfileOpen((p) => !p)}
              title="My Account"
            >
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <span className="user-name">Ram Sharma</span>
                <span className="user-role">Room Seeker</span>
              </div>
              <span className="chevron">{profileOpen ? "▲" : "▼"}</span>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="layout-content">
          {children}
        </div>

      </div>

      {/* ── Floating Message Button ── */}
      <button
        className="fab-msg-btn"
        onClick={() => { setChatOpen((c) => !c); setActiveThread(null); }}
        title="Messages"
      >
        💬
        <span className="fab-badge">{messageCount}</span>
      </button>

      {/* ── Chat Box ── */}
      {chatOpen && (
        <div className="chat-box">
          {activeThread === null ? (
            <>
              <div className="chat-box-header">
                <span>💬 Messages</span>
                <div className="chat-header-actions">
                  <button onClick={() => navigate("/messages")} title="Open full messages">⤢</button>
                  <button onClick={() => setChatOpen(false)}>✕</button>
                </div>
              </div>
              <div className="chat-thread-list">
                {chatThreads.map((t, i) => (
                  <div
                    className={`chat-thread-item ${t.unread ? "unread" : ""}`}
                    key={i}
                    onClick={() => setActiveThread(t)}
                  >
                    <div className="ct-avatar">{t.initials}</div>
                    <div className="ct-info">
                      <div className="ct-top">
                        <span className="ct-name">{t.name}</span>
                        <span className="ct-time">{t.time}</span>
                      </div>
                      <p className="ct-preview">{t.preview}</p>
                    </div>
                    {t.unread && <span className="ct-dot" />}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="chat-box-header">
                <button className="chat-back" onClick={() => setActiveThread(null)}>←</button>
                <div className="chat-header-user">
                  <div className="ct-avatar sm">{activeThread.initials}</div>
                  <span>{activeThread.name}</span>
                </div>
                <div className="chat-header-actions">
                  <button onClick={() => navigate("/messages")} title="Open full">⤢</button>
                  <button onClick={() => setChatOpen(false)}>✕</button>
                </div>
              </div>
              <div className="chat-messages">
                <div className="chat-msg other"><p>Hi! Are you still interested in the room?</p><span>2h ago</span></div>
                <div className="chat-msg other"><p>Can you visit this Saturday at 2 PM?</p><span>2h ago</span></div>
                <div className="chat-msg mine"><p>Yes, I'm still interested!</p><span>1h ago</span></div>
                <div className="chat-msg mine"><p>Saturday works for me. See you then!</p><span>1h ago</span></div>
              </div>
              <div className="chat-input-row">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setChatMessage("")}
                />
                <button onClick={() => setChatMessage("")}>➤</button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default Layout;