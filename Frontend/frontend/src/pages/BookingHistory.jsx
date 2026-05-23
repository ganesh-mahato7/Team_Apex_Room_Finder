import "../css/bookinghistory.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const BookingHistory = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
            <h2 className="page-title-header">Booking History</h2>
          </div>

          <div className="header-right">
            <button className="header-btn">🔔</button>
            <button className="header-btn">💬</button>

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
              <h1>Booking History</h1>
              <p>View and manage all your room booking requests</p>
            </div>

            <div className="search-filter">
              <input type="text" placeholder="Search bookings..." />
            </div>
          </div>

          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-value">8</span>
              <span className="stat-label">Total Bookings</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">2</span>
              <span className="stat-label">Pending</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">4</span>
              <span className="stat-label">Accepted</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">2</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>

          <div className="booking-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Pending</button>
            <button className="filter-btn">Accepted</button>
            <button className="filter-btn">Rejected</button>
          </div>

          <div className="booking-card current">
            <div className="booking-badge current">Current Stay</div>
            <div className="booking-details">
              <h3>2BHK Apartment, Baneshwor</h3>
              <p>Rs. 15,000 / month</p>
            </div>
          </div>

          <div className="booking-card">
            <div className="booking-badge pending">Pending</div>
            <div className="booking-details">
              <h3>Single Room, Pulchowk</h3>
              <p>Rs. 8,000 / month</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingHistory;