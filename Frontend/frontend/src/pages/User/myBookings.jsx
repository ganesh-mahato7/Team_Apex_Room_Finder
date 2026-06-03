import "../css/mybookings.css";
import Layout from "../components/Layout";

const MyBookings = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-title">
          <h1>My Bookings</h1>
          <p>Manage your room bookings and reservations</p>
        </div>
      </div>

      <div className="section">
        <div className="section-header"><h3>Active Bookings</h3></div>

        {[
          { title: "Cozy Room in Thamel",  loc: "Thamel, Kathmandu",  dates: "Mar 20 - May 20, 2026", price: "Rs. 15,000", owner: "Krishna Rai",  status: "Active",               bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", badge: "success" },
          { title: "Modern Flat in Patan", loc: "Patan, Lalitpur",    dates: "Mar 15 - May 15, 2026", price: "Rs. 25,000", owner: "Sita Thapa",   status: "Active",               bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", badge: "success" },
          { title: "Studio in Bhaktapur",  loc: "Bhaktapur",          dates: "Apr 1 - Jun 1, 2026",   price: "Rs. 12,000", owner: "Ramesh Magar", status: "Pending Confirmation", bg: "linear-gradient(135deg,#fef3c7,#fde68a)", badge: "pending" },
        ].map(({ title, loc, dates, price, owner, status, bg, badge }) => (
          <div className="booking-item" key={title}>
            <div className="booking-image" style={{ background: bg }} />
            <div className="booking-info">
              <h4>{title}</h4>
              <p className="location">{loc}</p>
              <div className="booking-meta">
                <span>📅 {dates}</span>
                <span>💰 {price}/month</span>
                <span>👤 {owner}</span>
              </div>
            </div>
            <div className="booking-status">
              <span className={`status-badge ${badge}`}>{status}</span>
              <div className="booking-actions">
                <button className="btn btn-sm btn-primary">{badge === "pending" ? "Confirm" : "View Details"}</button>
                <button className="btn btn-sm btn-outline">{badge === "pending" ? "Cancel" : "Message"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default MyBookings;