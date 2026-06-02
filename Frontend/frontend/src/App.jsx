// Frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home           from "./pages/Home";
import SignIn         from "./pages/SignIn";
import Register       from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import AddProperty    from "./pages/AddProperty";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/"                      element={<Home />} />
        <Route path="/signin"                element={<SignIn />} />
        <Route path="/register"              element={<Register />} />
        <Route path="/forgot-password"       element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/add-property"          element={<AddProperty />} />

        {/* Activation */}
        <Route path="/activate/:token" element={
          <div style={{ padding: 40, textAlign: "center", fontFamily: "Arial" }}>
            Activating your account...
          </div>
        } />

        {/* Dashboards */}
        <Route path="/user/dashboard"     element={<div style={{ padding: 40 }}>User Dashboard — Coming Soon</div>} />
        <Route path="/landlord/dashboard" element={<div style={{ padding: 40 }}>Landlord Dashboard — Coming Soon</div>} />
        <Route path="/admin/dashboard"    element={<div style={{ padding: 40 }}>Admin Dashboard — Coming Soon</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;