import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../../services/authService.js';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Invalid reset link');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await resetPassword(token, form.password);
      toast.success('Password reset! Please log in.');
      navigate('/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed. Try a new link.'); }
    finally { setLoading(false); }
  };

  if (!token) return (
    <div className="auth-page"><div className="auth-container"><div className="card auth-success">
      <div className="auth-success-icon auth-error-icon">!</div>
      <h2>Invalid Link</h2>
      <p>This reset link is invalid. Please request a new one.</p>
      <Link to="/forgot-password" className="btn btn-primary btn-full">Request New Link</Link>
    </div></div></div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">RoomFinder</h1>
          <p className="auth-subtitle">Set a new password</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="input" placeholder="Min. 6 characters" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required className="input" placeholder="Re-enter password" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p className="auth-footer-text"><Link to="/login" className="link">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;