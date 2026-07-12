import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaUser, FaHeart, FaClipboardList } from 'react-icons/fa';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

const COLORS = {
  primary: '#C9662D',
  text: '#3D2B1F',
  muted: '#8A7B6C',
  border: '#E8DCC8',
  bg: '#FAF3E7',
  white: '#FFFFFF',
};

const links = [
  { to: '/user/profile', label: 'Profile', icon: <FaUser /> },
  { to: '/user/favorites', label: 'Favorites', icon: <FaHeart /> },
  { to: '/user/requests', label: 'My Requests', icon: <FaClipboardList /> },
];

const UserLayout = () => {
  const { pathname } = useLocation();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '28px 24px', flex: 1, display: 'flex', gap: '28px' }}>
        <aside style={{ width: '204px', flexShrink: 0 }}>
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '12px', position: 'sticky', top: '84px' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {links.map(l => {
                const active = pathname.startsWith(l.to);
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: active ? 700 : 500,
                      textDecoration: 'none',
                      background: active ? COLORS.primary : 'transparent',
                      color: active ? COLORS.white : COLORS.text,
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = COLORS.bg; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: '14px', display: 'flex' }}>{l.icon}</span>{l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}><Outlet /></main>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;