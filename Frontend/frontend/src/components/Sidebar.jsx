import { Link, useLocation } from "react-router-dom";
import "../css/globalstyle.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <aside className="sidebar">
      
      {/* LOGO */}
      <div className="logo">
        <div className="logo-icon">🏠</div>
        <span className="logo-text">RoomFinder</span>
      </div>

      <nav className="nav-menu">

        {/* MAIN */}
        <div className="nav-section">
          <span className="nav-section-title">Main</span>

          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/search" className={isActive("/search")}>
            Search Rooms
          </Link>
        </div>

        {/* ACTIVITY */}
        <div className="nav-section">
          <span className="nav-section-title">My Activity</span>

          <Link to="/saved-listing" className={isActive("/saved-listing")}>
            Saved Listings <span className="badge">8</span>
          </Link>

          <Link to="/recently-viewed" className={isActive("/recently-viewed")}>
            Recently Viewed
          </Link>
        </div>

        {/* BOOKINGS */}
        <div className="nav-section">
          <span className="nav-section-title">Bookings</span>

          <Link to="/my-bookings" className={isActive("/my-bookings")}>
            My Bookings <span className="badge">3</span>
          </Link>

          <Link to="/upcoming-visit" className={isActive("/upcoming-visit")}>
            Scheduled Visits <span className="badge warning">2</span>
          </Link>

          <Link to="/booking-history" className={isActive("/booking-history")}>
            Booking History
          </Link>
        </div>

        {/* PAYMENTS */}
        <div className="nav-section">
          <span className="nav-section-title">Payments</span>

          <Link to="/payment-history" className={isActive("/payment-history")}>
            Payment History
          </Link>

          <Link to="/rent-payments" className={isActive("/rent-payments")}>
            Rent Payments
          </Link>
        </div>

        {/* ACCOUNT */}
        <div className="nav-section">
          <span className="nav-section-title">Account</span>

          <Link to="/profile" className={isActive("/profile")}>
            My Profile
          </Link>

          <Link to="/notifications" className={isActive("/notifications")}>
            Notifications
          </Link>
        </div>

      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <Link to="/" className="nav-item logout">
          Logout
        </Link>
      </div>

    </aside>
  );
};

export default Sidebar;