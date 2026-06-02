// No import from Sidebar needed — we dispatch a custom event instead

export const refreshSidebar = () => {
  window.dispatchEvent(new Event('sidebar-refresh'));
};

export const getInitials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

export const filterLabels = (role) => {
  if (role === 'Users')     return ['All Users',     'Active', 'Inactive', 'Verified', 'Unverified'];
  if (role === 'Landlords') return ['All Landlords', 'Verified', 'Unverified', 'Active', 'Inactive'];
  return                           ['All Tenants',   'Active', 'Inactive'];
};

export const countFor = (users, label) => {
  if (label.startsWith('All'))                        return users.length;
  if (label === 'Active'   || label === 'Verified')   return users.filter(u => u.is_active).length;
  if (label === 'Inactive' || label === 'Unverified') return users.filter(u => !u.is_active).length;
  return 0;
};

export const getFiltered = (users, activeFilter) => {
  if (activeFilter.startsWith('All'))                               return users;
  if (activeFilter === 'Active'   || activeFilter === 'Verified')   return users.filter(u => u.is_active === true);
  if (activeFilter === 'Inactive' || activeFilter === 'Unverified') return users.filter(u => u.is_active === false);
  return users;
};

export const handleBlockUser = async (u, API, onBlock) => {
  if (!window.confirm(`Block ${u.name}?`)) return;
  try {
    await fetch(`${API}/admin/users/block/${u.id}`, { method: 'PUT' });
    onBlock(u.id);
    refreshSidebar();
    alert(`${u.name} has been blocked successfully!`);
  } catch {
    alert('Failed to block user');
  }
};

export const handleSaveEdit = async (user, form, API, setSaving, setSuccess, onSave, onClose) => {
  setSaving(true);
  try {
    const res  = await fetch(`${API}/admin/users/${user.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      onSave({ ...user, ...form });
      setTimeout(() => { setSuccess(false); onClose(); }, 1500);
    } else {
      alert(data.message || 'Failed to update user');
    }
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    alert('Server error');
  }
  setSaving(false);
};