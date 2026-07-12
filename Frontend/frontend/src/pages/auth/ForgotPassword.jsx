import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService.js';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await forgotPassword(email); setSent(true); }
    catch (err) { toast.error(err.response?.data?.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">RoomFinder</h1>
          <p className="auth-subtitle">Reset your password</p>
        </div>
        <div className="card">
          {sent ? (
            <div className="auth-success">
              <div className="auth-success-icon">✓</div>
              <h2>Check your email</h2>
              <p>If an account exists for <strong>{email}</strong>, we've sent a reset link. Expires in 30 minutes.</p>
              <Link to="/login" className="btn btn-secondary btn-full">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              <p className="form-hint">Enter your account email and we'll send you a reset link.</p>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
          <p className="auth-footer-text">Remembered it? <Link to="/login" className="link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;