import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { login as loginApi } from '../../services/authService.js';
import toast from 'react-hot-toast';
import Logo from '../../components/common/Logo.jsx';

const COLORS = {
  primary: '#C9662D',
  primaryDark: '#A8511F',
  text: '#3D2B1F',
  muted: '#8A7B6C',
  border: '#E8DCC8',
  bg: '#FAF3E7',
  white: '#FFFFFF',
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(form);
      const { user, accessToken } = res.data.data;
      login(user, accessToken);
      toast.success(`Welcome back, ${user.name}!`);
      const redirects = { admin: '/admin/dashboard', landlord: '/landlord/dashboard', user: '/' };
      navigate(redirects[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const fieldWrap = (name) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: `1.5px solid ${focused === name ? COLORS.primary : COLORS.border}`,
    borderRadius: '10px',
    padding: '0 14px',
    transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
    boxShadow: focused === name ? `0 0 0 3px ${COLORS.primary}1F` : 'none',
    background: focused === name ? COLORS.white : COLORS.bg,
  });

  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: '12px 0',
    fontSize: '14px',
    color: COLORS.text,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: COLORS.bg,
        backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
        backgroundSize: '44px 44px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo size={44} />
          <p style={{ fontSize: '14px', color: COLORS.muted, marginTop: '10px' }}>Sign in to find your next room</p>
        </div>

        <div
          style={{
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '18px',
            padding: '32px',
            boxShadow: '0 12px 32px rgba(61,43,31,0.10)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: COLORS.muted, marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Email
              </label>
              <div style={fieldWrap('email')}>
                <FaEnvelope style={{ color: COLORS.muted, fontSize: '14px', flexShrink: 0 }} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: COLORS.primary, fontWeight: 600, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={fieldWrap('password')}>
                <FaLock style={{ color: COLORS.muted, fontSize: '14px', flexShrink: 0 }} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: COLORS.muted,
                    fontSize: '15px',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                marginTop: '4px',
                background: loading ? COLORS.primaryDark : COLORS.primary,
                color: COLORS.white,
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'default' : 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = COLORS.primaryDark; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = COLORS.primary; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: COLORS.muted, marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: COLORS.primary, fontWeight: 700, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;