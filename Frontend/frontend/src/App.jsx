import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/LandlordPages/home";
import AddProperty from "./pages/LandlordPages/AddProperty";
import LandlordDashboard from "./pages/LandlordPages/LandlordDashboard";
import RentCollection from "./pages/LandlordPages/RentCollection";
import MyListings from "./pages/LandlordPages/MyListings";
import BookingRequests from "./pages/LandlordPages/BookingRequests";
import Messages from "./pages/LandlordPages/Messages";
import ScheduledVisits from "./pages/LandlordPages/ScheduledVisits";
import ConfirmedBookings from "./pages/LandlordPages/ConfirmedBookings";

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