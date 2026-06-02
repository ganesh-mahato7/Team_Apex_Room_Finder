const API = 'http://localhost:5000/api/v1';

export const fetchBlockedUsers = (setBlockedUsers, setLoading) => {
  fetch(`${API}/users/all`)
    .then((res) => res.json())
    .then((data) => {
      setBlockedUsers(
        data.filter((u) => u.is_blocked === true)
      );
      setLoading(false);
    })
    .catch(() => setLoading(false));
};

export const getInitials = (name) => {
  return name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';
};

export const formatDate = (dateStr, long = false) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: long ? 'long' : 'short',
    day: 'numeric',
  });
};

export const getFilters = (blockedUsers) => {
  return [
    {
      label: 'All',
      count: blockedUsers.length,
    },
    {
      label: 'Blocked',
      count: blockedUsers.length,
    },
  ];
};

// OPEN POPUP
export const handleUnblockUser = (
  user,
  setPopupUser,
  setPopupAction,
  setPopupOpen
) => {
  setPopupUser(user);
  setPopupAction('unblock');
  setPopupOpen(true);
};

// CONFIRM UNBLOCK
export const confirmUnblockUser = async (
  popupUser,
  setBlockedUsers,
  setPopupOpen
) => {
  try {
    const res = await fetch(
      `${API}/admin/users/unblock/${popupUser.id}`,
      {
        method: 'PUT',
      }
    );

    if (res.ok) {
      setBlockedUsers((prev) =>
        prev.filter((u) => u.id !== popupUser.id)
      );

      alert(
        `${popupUser.name} has been unblocked successfully!`
      );
    } else {
      alert('Failed to unblock user');
    }
  } catch {
  alert('Server error');
}

  setPopupOpen(false);
};