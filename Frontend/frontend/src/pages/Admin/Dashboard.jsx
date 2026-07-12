import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import Loader from '../../components/common/Loader.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, color: '#C9662D', bg: '#FBF0E8', link: '/admin/users' },
    { label: 'Active Rooms', value: stats?.activeRooms ?? 0, color: '#6B7F5E', bg: '#E5EADF', link: '/admin/rooms' },
    { label: 'Open Reports', value: stats?.openReports ?? 0, color: '#C1442E', bg: '#FBE9E5', link: '/admin/reports' },
    { label: 'Pending Landlords', value: stats?.pendingLandlords ?? 0, color: '#B45309', bg: '#FEF3D9', link: '/admin/landlords' },
  ];

  return (
    <div className="space-y-6 warm-bg" style={{ minHeight: '100vh', padding: '28px', margin: '-28px' }}>
      <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link
            to={c.link}
            key={c.label}
            className="text-center transition"
            style={{
              textDecoration: 'none',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '22px',
              boxShadow: '0 2px 10px rgba(61,43,31,0.05)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(61,43,31,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(61,43,31,0.05)'; }}
          >
            <p className="font-display text-4xl font-bold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: '/admin/landlords', icon: '🏠', bg: '#FEF3D9', title: 'Verify Landlords', sub: `${stats?.pendingLandlords ?? 0} pending` },
          { to: '/admin/rooms', icon: '🔍', bg: '#FBF0E8', title: 'Review Rooms', sub: 'Approve or reject submitted rooms' },
          { to: '/admin/reports', icon: '🚩', bg: '#FBE9E5', title: 'Manage Reports', sub: `${stats?.openReports ?? 0} open reports` },
          { to: '/admin/users', icon: '👤', bg: '#E5EADF', title: 'Manage Users', sub: 'Ban or unban accounts' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 transition"
            style={{
              textDecoration: 'none',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '18px 20px',
              boxShadow: '0 2px 10px rgba(61,43,31,0.05)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div
              className="rounded-xl flex items-center justify-center text-2xl"
              style={{ width: '48px', height: '48px', flexShrink: 0, background: item.bg }}
            >
              {item.icon}
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text)' }}>{item.title}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{item.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;