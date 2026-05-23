import "../css/notification.css";
import "../css/globalstyle.css";

const Notifications = () => {
  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">🏠</div>
          <span className="logo-text">RoomFinder</span>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">
            <span className="nav-section-title">Main</span>
            <a href="#" className="nav-item">Dashboard</a>
            <a href="#" className="nav-item">Search Rooms</a>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">My Activity</span>
            <a href="#" className="nav-item">
              Saved Listings <span className="badge">8</span>
            </a>
            <a href="#" className="nav-item">Recently Viewed</a>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Bookings</span>
            <a href="#" className="nav-item">
              My Bookings <span className="badge">3</span>
            </a>
            <a href="#" className="nav-item">
              Scheduled Visits <span className="badge warning">2</span>
            </a>
            <a href="#" className="nav-item">Booking History</a>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Payments</span>
            <a href="#" className="nav-item">Payment History</a>
            <a href="#" className="nav-item">Rent Payments</a>
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Account</span>
            <a href="#" className="nav-item">My Profile</a>
            <a href="#" className="nav-item">Settings</a>
          </div>
        </nav>

        <div className="sidebar-footer">
          <a href="#" className="nav-item logout">Logout</a>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">

        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
            <h2 className="page-title-header">Notifications</h2>
          </div>

          <div className="header-right">
            <button className="header-btn">🔔</button>
            <button className="header-btn">
              💬 <span className="message-count">4</span>
            </button>

            <div className="user-profile">
              <div className="user-avatar">RS</div>
              <div className="user-info">
                <span className="user-name">Ram Sharma</span>
                <span className="user-role">Room Seeker</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Notifications</h1>
              <p>Stay updated with your room search activities</p>
            </div>

            <div className="header-actions">
              <button className="btn btn-outline">
                Mark All as Read
              </button>
              <button className="btn btn-outline">
                Settings
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="notification-filters">
            <button className="filter-btn active">All (12)</button>
            <button className="filter-btn">Unread (5)</button>
            <button className="filter-btn">Booking Updates</button>
            <button className="filter-btn">Messages</button>
            <button className="filter-btn">Payments</button>
            <button className="filter-btn">System</button>
          </div>

          {/* Notifications */}
          <div className="notifications-container">

            <div className="notification-group">
              <h3 className="group-title">Today</h3>

              <div className="notification-item unread">
                <div className="notification-content">
                  <h4>Booking Request Accepted</h4>
                  <p>
                    Your booking request for <b>2BHK Apartment, Baneshwor</b> has been accepted.
                  </p>
                  <span className="notification-time">2 hours ago</span>
                </div>
                <button className="btn btn-sm btn-primary">Pay Token</button>
              </div>

              <div className="notification-item unread">
                <div className="notification-content">
                  <h4>New Message</h4>
                  <p>You received a message from Sita Thapa</p>
                  <span className="notification-time">3 hours ago</span>
                </div>
                <button className="btn btn-sm btn-outline">View</button>
              </div>

            </div>

            <div className="notification-group">
              <h3 className="group-title">Yesterday</h3>

              <div className="notification-item">
                <div className="notification-content">
                  <h4>Payment Successful</h4>
                  <p>Rs. 12,000 rent payment completed</p>
                  <span className="notification-time">1 day ago</span>
                </div>
                <button className="btn btn-sm btn-outline">Receipt</button>
              </div>

            </div>

            <div className="load-more">
              <button className="btn btn-outline">
                Load More Notifications
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;