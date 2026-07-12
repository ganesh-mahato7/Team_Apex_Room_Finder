import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/resend-verification', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">RoomFinder</h1>
          <p className="auth-subtitle">Resend verification email</p>
        </div>
        <div className="card">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <FaCheckCircle style={{ fontSize: '48px', color: '#15803d', margin: '0 auto 16px' }} />
              <h2 style={{ color: '#111827', margin: '0 0 8px' }}>Email Sent!</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                If <strong>{email}</strong> is registered and unverified, a new link has been sent. Check your inbox.
              </p>
              <Link to="/login" className="btn btn-secondary btn-full">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              <p className="form-hint">Enter your registered email to receive a new verification link.</p>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="input" placeholder="you@example.com" style={{ paddingLeft: '36px' }} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-full"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FaEnvelope /> {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
          )}
          <p className="auth-footer-text">
            <Link to="/login" className="link">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;