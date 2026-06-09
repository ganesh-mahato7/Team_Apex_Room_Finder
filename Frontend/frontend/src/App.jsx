
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Regular pages
import Home           from "./pages/home";
import SignIn         from "./pages/SignIn";
import Register       from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import AddProperty    from "./pages/AddProperty";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users          from "./pages/Admin/Users";
import Listings       from "./pages/Admin/Listings";
import Reported       from "./pages/Admin/Reported";
import Outdated       from "./pages/Admin/Outdated";
import Payments       from "./pages/Admin/Payments";
import Feedback       from "./pages/Admin/Feedback";
import Analytics      from "./pages/Admin/Analytics";
import BlockedUsers   from "./pages/Admin/BlockedUsers";
import Settings       from "./pages/Admin/Settings";




function App() {
  return (
    <BrowserRouter>
      <Routes>


        {/* Regular Routes */}
        <Route path="/"                      element={<Home />} />
        <Route path="/signin"                element={<SignIn />} />
        <Route path="/register"              element={<Register />} />
        <Route path="/forgot-password"       element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/add-property"          element={<AddProperty />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard"       element={<AdminDashboard />} />
        <Route path="/admin/users"           element={<Users />} />
        <Route path="/admin/listings"        element={<Listings />} />
        <Route path="/admin/reported"        element={<Reported />} />
        <Route path="/admin/outdated"        element={<Outdated />} />
        <Route path="/admin/payments"        element={<Payments />} />
        <Route path="/admin/feedback"        element={<Feedback />} />
        <Route path="/admin/analytics"       element={<Analytics />} />
        <Route path="/admin/blocked-users"   element={<BlockedUsers />} />
        <Route path="/admin/settings"        element={<Settings />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;