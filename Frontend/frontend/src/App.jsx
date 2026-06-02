import { Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "./pages/Admin/Users";
import Listings from "./pages/Admin/Listings";
import Reported from "./pages/Admin/Reported";
import Outdated from "./pages/Admin/Outdated";
import Payments from "./pages/Admin/Payments";
import Feedback from "./pages/Admin/Feedback";
import Analytics from "./pages/Admin/Analytics";
import BlockedUsers from "./pages/Admin/BlockedUsers";
import Settings from "./pages/Admin/Settings";

function App() {
  return (
    <Routes>
      <Route path="/"              element={<AdminDashboard />} />
      <Route path="/users"         element={<Users />} />
      <Route path="/listings"      element={<Listings />} />
      <Route path="/reported"      element={<Reported />} />
      <Route path="/outdated"      element={<Outdated />} />
      <Route path="/payments"      element={<Payments />} />
      <Route path="/feedback"      element={<Feedback />} />
      <Route path="/analytics"     element={<Analytics />} />
      <Route path="/blocked-users" element={<BlockedUsers />} />
      <Route path="/settings"      element={<Settings />} />
    </Routes>
  );
}

export default App;