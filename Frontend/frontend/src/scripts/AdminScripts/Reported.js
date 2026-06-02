export const initialReports = [
  { id: 1, title: '2BHK Apartment, Kathmandu', listingId: '#LST-4521', reportedBy: 'Ram Sharma',   reason: 'fake',       reasonLabel: 'Fake Photos',     date: 'May 4, 2026',  status: 'pending'  },
  { id: 2, title: 'Single Room, Lalitpur',     listingId: '#LST-4518', reportedBy: 'Sita Thapa',   reason: 'duplicate',  reasonLabel: 'Duplicate',       date: 'May 3, 2026',  status: 'reviewed' },
  { id: 3, title: 'Flat, Bhaktapur',           listingId: '#LST-4502', reportedBy: 'Hari Prasad',  reason: 'scam',       reasonLabel: 'Potential Scam',  date: 'May 2, 2026',  status: 'pending'  },
  { id: 4, title: 'Studio Apartment, Patan',   listingId: '#LST-4489', reportedBy: 'Maya KC',      reason: 'misleading', reasonLabel: 'Misleading Info', date: 'Apr 30, 2026', status: 'resolved' },
  { id: 5, title: 'Room in Baneshwor',         listingId: '#LST-4475', reportedBy: 'Binod Tamang', reason: 'fake',       reasonLabel: 'Fake Photos',     date: 'Apr 28, 2026', status: 'pending'  },
  { id: 6, title: '1BHK Flat, Lazimpat',       listingId: '#LST-4460', reportedBy: 'Priya Gurung', reason: 'scam',       reasonLabel: 'Potential Scam',  date: 'Apr 25, 2026', status: 'reviewed' },
];

export const getFilters = (reports) => [
  { label: 'All',      count: reports.length },
  { label: 'Pending',  count: reports.filter(r => r.status === 'pending').length },
  { label: 'Reviewed', count: reports.filter(r => r.status === 'reviewed').length },
  { label: 'Resolved', count: reports.filter(r => r.status === 'resolved').length },
];

export const getFiltered = (reports, activeFilter) =>
  activeFilter === 'All'
    ? reports
    : reports.filter(r => r.status === activeFilter.toLowerCase());

export const handleDelete = (id, setReports) => {
  if (window.confirm('Are you sure you want to delete this listing?')) {
    setReports(prev => prev.filter(r => r.id !== id));
  }
};

export const handleBlock = (id, setReports) => {
  if (window.confirm('Are you sure you want to block this user?')) {
    alert('User has been blocked successfully!');
    setReports(prev => prev.filter(r => r.id !== id));
  }
};