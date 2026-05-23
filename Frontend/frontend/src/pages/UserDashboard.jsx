import "../css/UserDashboardStyle.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const UserDashboard = () => {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="main-content">

        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search for rooms, apartments, locations..."
              />
            </div>
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
            <div>
              <h1>Find Your Perfect Room</h1>

              <p>
                Browse available rooms, apartments, and flats in your preferred location.
              </p>
            </div>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <span className="stat-value">8</span>
              <span className="stat-label">Saved Listings</span>
            </div>

            <div className="stat-card">
              <span className="stat-value">3</span>
              <span className="stat-label">Active Bookings</span>
            </div>

            <div className="stat-card">
              <span className="stat-value">2</span>
              <span className="stat-label">Upcoming Visits</span>
            </div>

            <div className="stat-card">
              <span className="stat-value">4</span>
              <span className="stat-label">Unread Messages</span>
            </div>

          </div>

          <div className="hero-section">
            <img
              src="room.jpg"
              alt="Room"
              className="hero-image"
            />

            <div className="hero-overlay">
              <h2>Find Your Dream Space</h2>
              <p>Explore thousands of rooms across Nepal</p>

              <button className="btn btn-primary">
                Start Searching
              </button>
            </div>
          </div>

          <div className="section">
            <h3>Saved Listings</h3>

            <div className="listings-grid">

              <div className="listing-card">
                <h4>2BHK Apartment, Kathmandu</h4>
                <p>Baneshwor</p>
                <p>Rs. 15,000/month</p>

                <button className="btn btn-primary">
                  Book Visit
                </button>
              </div>

              <div className="listing-card">
                <h4>Single Room, Lalitpur</h4>
                <p>Pulchowk</p>
                <p>Rs. 8,000/month</p>

                <button className="btn btn-primary">
                  Book Visit
                </button>
              </div>

              <div className="listing-card">
                <h4>3BHK Flat, Bhaktapur</h4>
                <p>Suryabinayak</p>
                <p>Rs. 22,000/month</p>

                <button className="btn btn-primary">
                  Book Visit
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;