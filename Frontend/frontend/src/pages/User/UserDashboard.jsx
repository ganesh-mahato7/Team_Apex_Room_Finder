import "../css/UserDashboardStyle.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const savedListings = [
  { title: "2BHK Apartment, Kathmandu",   location: "Baneshwor, Kathmandu",    price: "Rs. 15,000", type: "APARTMENT", gradient: "apt"  },
  { title: "Single Room, Lalitpur",       location: "Pulchowk, Lalitpur",      price: "Rs. 8,000",  type: "ROOM",      gradient: "room" },
  { title: "3BHK Flat, Bhaktapur",        location: "Suryabinayak, Bhaktapur", price: "Rs. 22,000", type: "FLAT",      gradient: "flat" },
];

const stats = [
  { value: "8",  label: "Saved Listings",  icon: "🏷️", colorClass: "saved"    },
  { value: "3",  label: "Active Bookings", icon: "📋", colorClass: "bookings" },
  { value: "2",  label: "Upcoming Visits", icon: "📅", colorClass: "visits"   },
  { value: "4",  label: "Unread Messages", icon: "💬", colorClass: "messages" },
];

const recentActivity = [
  { icon: "✅", text: "Booking confirmed for Single Room, Lalitpur",   time: "2 hours ago", type: "success" },
  { icon: "📅", text: "Visit scheduled for 2BHK Apartment on May 10",  time: "5 hours ago", type: "info"    },
  { icon: "💬", text: "New message from landlord of 3BHK Flat",         time: "1 day ago",   type: "message" },
  { icon: "🏷️", text: "You saved 3BHK Flat, Bhaktapur",                time: "2 days ago",  type: "saved"   },
];

const navLinks = [
  { section: "MAIN",        items: [{ label: "Dashboard", href: "/dashboard" }, { label: "Search Rooms", href: "/search" }] },
  { section: "MY ACTIVITY", items: [{ label: "Saved Listings", href: "/saved-listing", badge: "8" }, { label: "Recently Viewed", href: "/recently-viewed" }] },
  { section: "BOOKINGS",    items: [{ label: "My Bookings", href: "/my-bookings", badge: "3" }, { label: "Scheduled Visits", href: "/upcoming-visit", badge: "2", badgeClass: "warning" }, { label: "Booking History", href: "/booking-history" }] },
  { section: "PAYMENTS",    items: [{ label: "Payment History", href: "/payment-history" }, { label: "Rent Payments", href: "/rent-payments" }] },
  { section: "ACCOUNT",     items: [{ label: "My Profile", href: "/profile" }, { label: "Settings", href: "/settings" }] },
];

const chatThreads = [
  { initials: "KR", name: "Krishna Rai",   preview: "Hi! Are you still interested?",       time: "2h",  unread: true  },
  { initials: "ST", name: "Sita Thapa",    preview: "The flat is available from 15th...",   time: "1d",  unread: false },
  { initials: "RM", name: "Ramesh Magar",  preview: "Thank you for booking!",               time: "Mar", unread: false },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen]       = useState(false);
  const [chatOpen, setChatOpen]             = useState(false);
  const [activeThread, setActiveThread]     = useState(null);
  const [chatMessage, setChatMessage]       = useState("");

  const handleNavClick = (href) => {
    setProfileOpen(false);
    navigate(href);
  };

  return (
    <div className="dashboard-container">

      {/* ── Profile Sidebar Overlay ── */}
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

      {/* ── Main Content ── */}
      <main className="main-content full-width">

        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className="logo-inline">
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
              <span className="notif-dot" />
            </button>

            {/* Profile button — triggers sliding sidebar */}
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

        {/* Dashboard Content */}
        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Welcome back, Ram! 👋</h1>
              <p>Browse available rooms, apartments, and flats in your preferred location.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/search")}>
              + Search Rooms
            </button>
          </div>

          <div className="stats-grid">
            {stats.map(({ value, label, icon, colorClass }) => (
              <div className="stat-card" key={label}>
                <div className={`stat-icon ${colorClass}`}>{icon}</div>
                <div className="stat-info">
                  <span className="stat-value">{value}</span>
                  <span className="stat-label">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-section">
            <div className="hero-bg" />
            <div className="hero-overlay">
              <div className="hero-text">
                <h2>Find Your Dream Space</h2>
                <p>Explore thousands of verified rooms across Nepal</p>
                <div className="hero-btns">
                  <button className="btn btn-white">🔍 Start Searching</button>
                  <button className="btn btn-outline-white">📍 Browse by Location</button>
                </div>
              </div>
              <div className="hero-badges">
                <div className="hero-badge"><span className="badge-value">2,400+</span><span className="badge-label">Listings</span></div>
                <div className="hero-badge"><span className="badge-value">1,200+</span><span className="badge-label">Landlords</span></div>
                <div className="hero-badge"><span className="badge-value">3 Cities</span><span className="badge-label">Available</span></div>
              </div>
            </div>
          </div>

          <div className="main-grid">
            <div className="grid-left">
              <div className="section-header">
                <h3>Saved Listings</h3>
                <a href="/saved-listing" className="view-all">View All →</a>
              </div>
              <div className="listings-grid">
                {savedListings.map(({ title, location, price, type, gradient }) => (
                  <div className="listing-card" key={title}>
                    <div className="listing-image">
                      <div className={`placeholder-image ${gradient}`} />
                      <span className="listing-badge verified">✔ Verified</span>
                      <button className="save-btn saved">❤️</button>
                    </div>
                    <div className="listing-details">
                      <span className="listing-type">{type}</span>
                      <h4 className="listing-title">{title}</h4>
                      <p className="listing-location">📍 {location}</p>
                      <div className="listing-footer">
                        <span className="listing-price">{price}<span>/month</span></span>
                        <button className="btn btn-primary btn-sm">Book Visit</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid-right">
              <div className="section-header">
                <h3>Recent Activity</h3>
                <a href="#" className="view-all">View All →</a>
              </div>
              <div className="activity-card">
                {recentActivity.map(({ icon, text, time, type }, i) => (
                  <div className="activity-item" key={i}>
                    <div className={`activity-icon-wrap ${type}`}>{icon}</div>
                    <div className="activity-info">
                      <p className="activity-text">{text}</p>
                      <span className="activity-time">{time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-header" style={{ marginTop: "20px" }}>
                <h3>Quick Actions</h3>
              </div>
              <div className="quick-actions">
                {[
                  { icon: "🔍", label: "Search Rooms",  href: "/search"          },
                  { icon: "📋", label: "My Bookings",   href: "/my-bookings"     },
                  { icon: "📅", label: "Visits",        href: "/upcoming-visit"  },
                  { icon: "💳", label: "Rent Payments", href: "/rent-payments"   },
                ].map(({ icon, label, href }) => (
                  <a href={href} className="quick-action-btn" key={label}>
                    <span className="qa-icon">{icon}</span>
                    <span className="qa-label">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Floating Message Button ── */}
      <button
        className="fab-msg-btn"
        onClick={() => { setChatOpen((c) => !c); setActiveThread(null); }}
        title="Messages"
      >
        💬
        <span className="fab-badge">4</span>
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
                <button className="chat-back" onClick={() => setActiveThread(null)}>← </button>
                <div className="chat-header-user">
                  <div className="ct-avatar sm">{activeThread.initials}</div>
                  <span>{activeThread.name}</span>
                </div>
                <div className="chat-header-actions">
                  <button onClick={() => navigate("/messages")} title="Open full messages">⤢</button>
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

export default UserDashboard;