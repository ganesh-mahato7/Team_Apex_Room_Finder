import "../css/bookinghistory.css";
import Layout from "../components/Layout";

const BookingHistory = () => {
  return (
    <Layout>
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
        {[["8","Total Bookings"],["2","Pending"],["4","Accepted"],["2","Rejected"]].map(([v,l]) => (
          <div className="stat-item" key={l}>
            <span className="stat-value">{v}</span>
            <span className="stat-label">{l}</span>
          </div>
        ))}
      </div>

      <div className="booking-filters">
        {["All","Pending","Accepted","Rejected"].map((f, i) => (
          <button className={`filter-btn ${i === 0 ? "active" : ""}`} key={f}>{f}</button>
        ))}
      </div>

      <div className="booking-card current">
        <div className="booking-badge current">Current Stay</div>
        <div className="booking-details"><h3>2BHK Apartment, Baneshwor</h3><p>Rs. 15,000 / month</p></div>
      </div>

      <div className="booking-card">
        <div className="booking-badge pending">Pending</div>
        <div className="booking-details"><h3>Single Room, Pulchowk</h3><p>Rs. 8,000 / month</p></div>
      </div>
    </Layout>
  );
};

export default BookingHistory;