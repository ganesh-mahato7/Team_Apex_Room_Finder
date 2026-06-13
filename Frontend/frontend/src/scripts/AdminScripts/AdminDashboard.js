const API = 'http://localhost:5000/api/v1';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const fetchDashboardStats = (setStats, setLoading) => {
  fetch(`${API}/admin/stats`, { headers: authHeaders() })
    .then(res => res.json())
    .then(data => { setStats(data); setLoading(false); })
    .catch(err => { console.error(err); setLoading(false); });
};

export const fetchRecentUsers = (setRecentUsers) => {
  fetch(`${API}/admin/users/all`, { headers: authHeaders() })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setRecentUsers(data.slice(0, 4));
      }
    })
    .catch(err => console.error(err));
};

export const getInitials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

export const getRoleLabel = (role) => {
  if (role === 'landlord') return 'Landlord';
  if (role === 'tenant')   return 'Tenant';
  return 'Room Seeker';
};

export const getRoleClass = (role) => {
  if (role === 'landlord') return 'landlord';
  if (role === 'tenant')   return 'tenant';
  return 'seeker';
};