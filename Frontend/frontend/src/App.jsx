import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Dashboard
import UserDashboard from "./pages/UserDashboard";

// Pages
import Messages from "./pages/Messages";
import MyBookings from "./pages/MyBookings";
import BookingHistory from "./pages/BookingHistory";
import Notifications from "./pages/Notifications";
import PaymentHistory from "./pages/PaymentHistory";
import Profile from "./pages/Profile";
import RecentlyViewed from "./pages/RecentlyViewed";
import RentPayments from "./pages/RentPayments";
import SavedListing from "./pages/SavedListing";
import UpcomingVisit from "./pages/UpcomingVisit";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<UserDashboard />} />

        <Route path="/search" element={<UserDashboard />} />

        <Route path="/messages" element={<Messages />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recently-viewed" element={<RecentlyViewed />} />
        <Route path="/rent-payments" element={<RentPayments />} />
        <Route path="/saved-listing" element={<SavedListing />} />
        <Route path="/upcoming-visit" element={<UpcomingVisit />} />

      </Routes>
    </Router>
  );
}

export default App;