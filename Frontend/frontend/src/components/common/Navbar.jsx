import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FaSearch, FaComments, FaBell, FaSignOutAlt, FaTachometerAlt, FaUser, FaChevronDown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Logo from './Logo.jsx';

const COLORS = {
  primary: '#C9662D',
  primaryDark: '#A8511F',
  primaryLight: '#FBF0E8',
  text: '#3D2B1F',
  muted: '#8A7B6C',
  border: '#E8DCC8',
  bg: '#FAF3E7',
  white: '#FFFFFF',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const dashboardPath = { admin: '/admin/dashboard', landlord: '/landlord/dashboard', user: '/user/profile' };
  const profilePath = { admin: '/admin/dashboard', landlord: '/user/profile', user: '/user/profile' };

  const linkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    color: active ? COLORS.primary : COLORS.muted,
    background: active ? COLORS.primaryLight : 'transparent',
    transition: 'background 0.15s, color 0.15s',
  });

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  return (
    <nav
      style={{
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size={34} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <Link to="/" style={linkStyle(isActive('/'))}>
            <FaSearch style={{ fontSize: '12px' }} />Browse
          </Link>

          {user ? (
            <>
              <Link to={dashboardPath[user.role] || '/'} style={linkStyle(isActive(dashboardPath[user.role] || ''))}>
                <FaTachometerAlt style={{ fontSize: '12px' }} />Dashboard
              </Link>

              {(user.role === 'user' || user.role === 'landlord') && (
                <Link to="/chats" style={linkStyle(isActive('/chats'))}>
                  <FaComments style={{ fontSize: '12px' }} />Chats
                </Link>
              )}

              <Link
                to="/notifications"
                title="Notifications"
                style={{ ...linkStyle(isActive('/notifications')), padding: '8px', marginLeft: '2px' }}
              >
                <FaBell style={{ fontSize: '14px' }} />
              </Link>

              {/* Profile dropdown */}
              <div ref={menuRef} style={{ position: 'relative', marginLeft: '6px' }}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px 6px 6px',
                    borderRadius: '999px',
                    background: menuOpen ? COLORS.bg : 'transparent',
                    border: `1px solid ${menuOpen ? COLORS.border : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: COLORS.primary,
                      color: COLORS.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.text }}>{user.name}</span>
                  <FaChevronDown style={{ fontSize: '9px', color: COLORS.muted, transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>

                {menuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: COLORS.white,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(61,43,31,0.12)',
                      minWidth: '180px',
                      overflow: 'hidden',
                      zIndex: 50,
                    }}
                  >
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${COLORS.border}` }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: COLORS.text }}>{user.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: COLORS.muted, textTransform: 'capitalize' }}>{user.role}</p>
                    </div>
                    <Link
                      to={profilePath[user.role] || '/user/profile'}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: COLORS.text, textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FaUser style={{ fontSize: '12px', color: COLORS.primary }} />Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#C1442E', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FaSignOutAlt style={{ fontSize: '12px' }} />Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle(isActive('/login'))}>Login</Link>
              <Link
                to="/register"
                style={{
                  padding: '8px 18px',
                  marginLeft: '4px',
                  borderRadius: '8px',
                  background: COLORS.primary,
                  color: COLORS.white,
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;