const API = 'http://localhost:5000/api/v1';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const fetchBlockedUsers = (setBlockedUsers, setLoading) => {
  fetch(`${API}/admin/users/all`, { headers: authHeaders() })
    .then(res => res.json())
    .then(data => {
      setBlockedUsers(Array.isArray(data) ? data.filter(u => u.is_blocked === true) : []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
};

export const getInitials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

export const formatDate = (dateStr, long = false) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: long ? 'long' : 'short', day: 'numeric',
  });

export const confirmUnblockUser = async (user, setBlockedUsers, setShowConfirm, setSuccess) => {
  try {
    const res = await fetch(`${API}/admin/users/unblock/${user.id}`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    if (res.ok) {
      setBlockedUsers(prev => prev.filter(u => u.id !== user.id));
      setShowConfirm(false);
      setSuccess(`${user.name} has been unblocked successfully!`);
    } else {
      alert('Failed to unblock user');
    }
  } catch {
    alert('Server error');
  }
};