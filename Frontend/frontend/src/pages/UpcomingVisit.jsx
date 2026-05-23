import "../css/UpcomingVisit.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const UpcomingVisit = () => {
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
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <span className="user-name">Ram Sharma</span>
                <span className="user-role">Room Seeker</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          <div className="page-header">
            <h1>Scheduled Visits</h1>
            <p>Your upcoming property viewing appointments</p>
          </div>

          <div className="section">
            <h3>Upcoming Visits</h3>

            <div className="visit-card">
              <div className="visit-header">
                <div className="visit-date-badge">
                  <span className="day">23</span>
                  <span className="month">Mar</span>
                </div>

                <div className="visit-title">
                  <h4>Beautiful Room in Thamel</h4>
                  <p>Thamel, Kathmandu</p>
                </div>
              </div>

              <div className="visit-details">
                <span>🕐 2:00 PM - 3:00 PM</span>
                <span>👤 Krishna Rai</span>
              </div>

              <div className="visit-actions">
                <button className="btn btn-primary">Reschedule</button>
                <button className="btn btn-outline">Cancel</button>
              </div>
            </div>

            <div className="visit-card">
              <div className="visit-header">
                <div className="visit-date-badge">
                  <span className="day">25</span>
                  <span className="month">Mar</span>
                </div>

                <div className="visit-title">
                  <h4>Cozy Flat in Patan</h4>
                  <p>Patan, Lalitpur</p>
                </div>
              </div>

              <div className="visit-details">
                <span>🕐 10:00 AM - 11:00 AM</span>
                <span>👤 Sita Thapa</span>
              </div>

              <div className="visit-actions">
                <button className="btn btn-primary">Reschedule</button>
                <button className="btn btn-outline">Cancel</button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default UpcomingVisit;