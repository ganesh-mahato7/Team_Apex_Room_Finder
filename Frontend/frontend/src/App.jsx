import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import AddProperty from "./pages/AddProperty";
import LandlordDashboard from "./pages/LandlordDashboard";
import RentCollection from "./pages/RentCollection";
import MyListings from "./pages/MyListings";
import BookingRequests from "./pages/BookingRequests";
import Messages from "./pages/Messages";
import ScheduledVisits from "./pages/ScheduledVisits";
import ConfirmedBookings from "./pages/ConfirmedBookings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/" element={<LandlordDashboard />} />
        <Route path="/rent-collection" element={<RentCollection />} />
        <Route path="/My-listings" element={<MyListings />} />
        <Route path="/Booking-Requests" element={<BookingRequests/>} />
        <Route path="/Messages" element={<Messages/>} />
        <Route path="/Scheduled-Visits" element={<ScheduledVisits/>} />
        <Route path="/Confirmed-Bookings" element={<ConfirmedBookings/>} />







      </Routes>
    </Router>
  );
}

export default App;