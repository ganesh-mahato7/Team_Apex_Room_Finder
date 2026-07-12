import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaHome, FaPlusCircle, FaComments, FaUser } from 'react-icons/fa';
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
  { to: '/landlord/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/landlord/my-rooms', label: 'My Rooms', icon: <FaHome /> },
  { to: '/landlord/add-room', label: 'Add Room', icon: <FaPlusCircle /> },
  { to: '/chats', label: 'Chats', icon: <FaComments /> },
  { to: '/user/profile', label: 'Profile', icon: <FaUser /> },
];

const LandlordLayout = () => {
  const { pathname } = useLocation();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '28px 24px', flex: 1, display: 'flex', gap: '28px' }}>
        <aside style={{ width: '224px', flexShrink: 0 }}>
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '18px 12px', position: 'sticky', top: '84px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', padding: '0 10px', marginBottom: '10px', letterSpacing: '0.06em' }}>
              Landlord
            </p>
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

export default LandlordLayout;