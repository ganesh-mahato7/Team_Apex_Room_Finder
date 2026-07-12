import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaEnvelope } from 'react-icons/fa';
import api from '../../services/api.js';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('No verification token found.'); return; }
    api.get(`/auth/verify-email?token=${token}`)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message);
        setRole(res.data.data?.role || '');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">RoomFinder</h1>
          <p className="auth-subtitle">Email Verification</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          {status === 'loading' && (
            <>
              <FaSpinner style={{ fontSize: '48px', color: '#2563eb', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: '#6b7280' }}>Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <FaCheckCircle style={{ fontSize: '56px', color: '#15803d', margin: '0 auto 16px' }} />
              <h2 style={{ color: '#111827', margin: '0 0 8px' }}>Email Verified!</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>{message}</p>

              {role === 'landlord' && (
                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                  <p style={{ fontWeight: 600, color: '#b45309', margin: '0 0 8px', fontSize: '14px' }}>
                    🏠 Next Step for Landlords
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                    Log in and go to your Profile to submit your verification documents:
                    ID image, selfie with ID, land ownership document, and building image.
                    Admin will approve your account within 24-48 hours.
                  </p>
                </div>
              )}

              {role === 'user' && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                  <p style={{ fontWeight: 600, color: '#15803d', margin: '0 0 8px', fontSize: '14px' }}>
                    ✅ You're all set!
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                    You can now log in and start browsing rooms. You can optionally verify your identity from your profile.
                  </p>
                </div>
              )}

              <Link to="/login" className="btn btn-primary btn-full">
                Continue to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <FaTimesCircle style={{ fontSize: '56px', color: '#dc2626', margin: '0 auto 16px' }} />
              <h2 style={{ color: '#111827', margin: '0 0 8px' }}>Verification Failed</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>{message}</p>
              <Link to="/resend-verification" className="btn btn-primary btn-full" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <FaEnvelope /> Resend Verification Email
              </Link>
              <Link to="/login" className="link" style={{ fontSize: '13px' }}>Back to Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;