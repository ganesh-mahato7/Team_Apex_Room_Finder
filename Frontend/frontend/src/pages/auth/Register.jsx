import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaSearch, FaHome, FaCheckCircle } from 'react-icons/fa';
import { register as registerApi } from '../../services/authService.js';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await registerApi(form);
      setRegisteredEmail(form.email);
      setRegistered(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  if (registered) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-logo">RoomFinder</h1>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
            <FaCheckCircle style={{ fontSize: '56px', color: '#15803d', margin: '0 auto 16px' }} />
            <h2 style={{ color: '#111827', margin: '0 0 8px' }}>Check your email!</h2>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>
              We sent a verification link to <strong>{registeredEmail}</strong>.
            </p>
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '13px' }}>
              Click the link in your email to activate your account. Check your spam folder if you don't see it.
            </p>

            {form.role === 'landlord' && (
              <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                <p style={{ fontWeight: 600, color: '#b45309', margin: '0 0 6px', fontSize: '14px' }}>🏠 Landlord next steps:</p>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '13px', lineHeight: '1.8' }}>
                  <li>Verify your email (link sent above)</li>
                  <li>Log in to your account</li>
                  <li>Go to Profile → Submit verification documents</li>
                  <li>Upload: ID image, selfie with ID, land document, building image</li>
                  <li>Wait for admin approval (24-48 hrs)</li>
                  <li>Start posting rooms!</li>
                </ol>
              </div>
            )}

            <Link to="/login" className="btn btn-secondary btn-full" style={{ marginBottom: '8px', display: 'block' }}>Go to Login</Link>
            <Link to="/resend-verification" className="link" style={{ fontSize: '13px' }}>Didn't receive it? Resend</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">RoomFinder</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input name="name" value={form.name} onChange={handleChange} required
                  className="input" placeholder="John Doe" style={{ paddingLeft: '36px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="input" placeholder="you@example.com" style={{ paddingLeft: '36px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <div style={{ position: 'relative' }}>
                <FaPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="input" placeholder="+977 98XXXXXXXX" style={{ paddingLeft: '36px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                  className="input" placeholder="Min. 6 characters" style={{ paddingLeft: '36px', paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'user',     icon: <FaSearch />, label: 'Room Seeker',
                    desc: 'Browse and rent rooms' },
                  { value: 'landlord', icon: <FaHome />,   label: 'Landlord',
                    desc: 'List and manage rooms' },
                ].map(r => (
                  <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                    style={{ padding: '14px 12px', borderRadius: '10px', textAlign: 'left',
                      border: form.role === r.value ? '2px solid #2563eb' : '2px solid #e5e7eb',
                      background: form.role === r.value ? '#eff6ff' : '#fff',
                      cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: form.role === r.value ? '#2563eb' : '#374151', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                      {r.icon} {r.label}
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{r.desc}</p>
                  </button>
                ))}
              </div>

              {form.role === 'landlord' && (
                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '10px 14px', marginTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#b45309' }}>
                    ℹ️ After email verification, you'll need to submit: <strong>ID proof, selfie with ID, land ownership document, and building photo</strong> for admin approval before posting rooms.
                  </p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer-text">
            Already have an account? <Link to="/login" className="link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;