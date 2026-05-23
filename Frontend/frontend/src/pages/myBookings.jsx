import "../css/mybookings.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const MyBookings = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
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

        <div className="dashboard-content">
          <div className="page-header">
            <div className="page-title">
              <h1>My Bookings</h1>
              <p>Manage your room bookings and reservations</p>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <h3>Active Bookings</h3>
            </div>

            <div className="booking-item">
              <div
                className="booking-image"
                style={{
                  background:
                    "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                }}
              ></div>

              <div className="booking-info">
                <h4>Cozy Room in Thamel</h4>

                <p className="location">Thamel, Kathmandu</p>

                <div className="booking-meta">
                  <span>📅 Mar 20 - May 20, 2026</span>
                  <span>💰 Rs. 15,000/month</span>
                  <span>👤 Krishna Rai</span>
                </div>
              </div>

              <div className="booking-status">
                <span className="status-badge success">
                  Active
                </span>

                <div className="booking-actions">
                  <button className="btn btn-sm btn-primary">
                    View Details
                  </button>

                  <button className="btn btn-sm btn-outline">
                    Message
                  </button>
                </div>
              </div>
            </div>

            <div className="booking-item">
              <div
                className="booking-image"
                style={{
                  background:
                    "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                }}
              ></div>

              <div className="booking-info">
                <h4>Modern Flat in Patan</h4>

                <p className="location">Patan, Lalitpur</p>

                <div className="booking-meta">
                  <span>📅 Mar 15 - May 15, 2026</span>
                  <span>💰 Rs. 25,000/month</span>
                  <span>👤 Sita Thapa</span>
                </div>
              </div>

              <div className="booking-status">
                <span className="status-badge success">
                  Active
                </span>

                <div className="booking-actions">
                  <button className="btn btn-sm btn-primary">
                    View Details
                  </button>

                  <button className="btn btn-sm btn-outline">
                    Message
                  </button>
                </div>
              </div>
            </div>

            <div className="booking-item">
              <div
                className="booking-image"
                style={{
                  background:
                    "linear-gradient(135deg, #fef3c7, #fde68a)",
                }}
              ></div>

              <div className="booking-info">
                <h4>Studio in Bhaktapur</h4>

                <p className="location">Bhaktapur</p>

                <div className="booking-meta">
                  <span>📅 Apr 1 - Jun 1, 2026</span>
                  <span>💰 Rs. 12,000/month</span>
                  <span>👤 Ramesh Magar</span>
                </div>
              </div>

              <div className="booking-status">
                <span className="status-badge pending">
                  Pending Confirmation
                </span>

                <div className="booking-actions">
                  <button className="btn btn-sm btn-primary">
                    Confirm
                  </button>

                  <button className="btn btn-sm btn-outline">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyBookings;