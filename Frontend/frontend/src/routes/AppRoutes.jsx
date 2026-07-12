import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';

import UserLayout     from '../layouts/UserLayout.jsx';
import LandlordLayout from '../layouts/LandlordLayout.jsx';
import AdminLayout    from '../layouts/AdminLayout.jsx';

import Login               from '../pages/auth/Login.jsx';
import Register            from '../pages/auth/Register.jsx';
import ForgotPassword      from '../pages/auth/ForgotPassword.jsx';
import ResetPassword       from '../pages/auth/ResetPassword.jsx';
import VerifyEmail         from '../pages/auth/VerifyEmail.jsx';
import ResendVerification  from '../pages/auth/ResendVerification.jsx';

import Home        from '../pages/user/Home.jsx';
import RoomDetails from '../pages/user/RoomDetails.jsx';
import Profile     from '../pages/user/Profile.jsx';
import Favorites   from '../pages/user/Favorites.jsx';
import MyChats     from '../pages/user/MyChats.jsx';

import LandlordDashboard from '../pages/landlord/Dashboard.jsx';
import AddRoom           from '../pages/landlord/AddRoom.jsx';
import EditRoom          from '../pages/landlord/EditRoom.jsx';
import MyRooms           from '../pages/landlord/MyRooms.jsx';

import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminUsers     from '../pages/admin/Users.jsx';
import AdminLandlords from '../pages/admin/Landlords.jsx';
import AdminRooms     from '../pages/admin/Rooms.jsx';
import AdminReports   from '../pages/admin/Reports.jsx';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"           element={<Home />} />
    <Route path="/rooms/:id"  element={<RoomDetails />} />
    <Route path="/login"      element={<Login />} />
    <Route path="/register"   element={<Register />} />
    <Route path="/forgot-password"     element={<ForgotPassword />} />
    <Route path="/reset-password"      element={<ResetPassword />} />
    <Route path="/verify-email"        element={<VerifyEmail />} />
    <Route path="/resend-verification" element={<ResendVerification />} />

    {/* Shared chats */}
    <Route path="/chats" element={
      <ProtectedRoute roles={['user', 'landlord']}><MyChats /></ProtectedRoute>
    } />

    {/* User routes */}
    <Route path="/user" element={
      <ProtectedRoute roles={['user', 'landlord']}><UserLayout /></ProtectedRoute>
    }>
      <Route path="profile"   element={<Profile />} />
      {/* Favorites is a 'user'-only feature on the backend (requireRole('user'))
          — gate it separately so landlords can't land on a page that will 403 */}
      <Route path="favorites" element={
        <ProtectedRoute roles={['user']}><Favorites /></ProtectedRoute>
      } />
      <Route index element={<Navigate to="profile" replace />} />
    </Route>

    {/* Landlord routes */}
    <Route path="/landlord" element={
      <ProtectedRoute roles={['landlord']}><LandlordLayout /></ProtectedRoute>
    }>
      <Route path="dashboard"    element={<LandlordDashboard />} />
      <Route path="my-rooms"     element={<MyRooms />} />
      <Route path="add-room"     element={<AddRoom />} />
      <Route path="edit-room/:id" element={<EditRoom />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Admin routes */}
    <Route path="/admin" element={
      <ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>
    }>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users"     element={<AdminUsers />} />
      <Route path="landlords" element={<AdminLandlords />} />
      <Route path="rooms"     element={<AdminRooms />} />
      <Route path="reports"   element={<AdminReports />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;