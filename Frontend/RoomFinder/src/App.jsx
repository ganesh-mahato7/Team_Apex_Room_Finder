import { Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import Landlords from "./pages/Landlords";
import Listings from "./pages/Listings";
import Reported from "./pages/Reported";
import Outdated from "./pages/Outdated";
import Payments from "./pages/Payments";
import Feedback from "./pages/Feedback";
import Analytics from "./pages/Analytics";
import BlockedUsers from "./pages/BlockedUsers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/landlords" element={<Landlords />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/reported" element={<Reported />} />
      <Route path="/outdated" element={<Outdated />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/blocked-users" element={<BlockedUsers />} />
    </Routes>
  );
}

export default App;