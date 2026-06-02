const API = 'http://localhost:5000/api/v1';

export const fetchFeedback = (setFeedbacks, setLoading) => {
  fetch(`${API}/admin/feedback`)
    .then(res => res.json())
    .then(data => { setFeedbacks(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(err => { console.error(err); setLoading(false); });
};

export const handleResolve = async (id, setFeedbacks, setLoading) => {
  await fetch(`${API}/admin/feedback/resolve/${id}`, { method: 'PUT' });
  fetchFeedback(setFeedbacks, setLoading);
};

export const handleReopen = async (id, setFeedbacks, setLoading) => {
  await fetch(`${API}/admin/feedback/reopen/${id}`, { method: 'PUT' });
  fetchFeedback(setFeedbacks, setLoading);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const typeClass = (type) => {
  if (type === 'complaint')  return 'complaint';
  if (type === 'suggestion') return 'suggestion';
  if (type === 'bug_report') return 'bug-report';
  return 'suggestion';
};

export const typeLabel = (type) => {
  if (type === 'complaint')  return 'Complaint';
  if (type === 'suggestion') return 'Suggestion';
  if (type === 'bug_report') return 'Bug Report';
  return type;
};

export const getCounts = (feedbacks) => ({
  All:          feedbacks.length,
  Complaint:    feedbacks.filter(f => f.type === 'complaint').length,
  Suggestion:   feedbacks.filter(f => f.type === 'suggestion').length,
  'Bug Report': feedbacks.filter(f => f.type === 'bug_report').length,
  Pending:      feedbacks.filter(f => f.status === 'pending').length,
  Resolved:     feedbacks.filter(f => f.status === 'resolved').length,
});