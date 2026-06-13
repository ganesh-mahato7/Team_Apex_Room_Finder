const API = 'http://localhost:5000/api/v1';

export const fetchPayments = (setPayments, setLoading) => {
  fetch(`${API}/admin/payments`)
    .then(res => res.json())
    .then(data => { setPayments(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(err => { console.error(err); setLoading(false); });
};

export const getFiltered = (payments, activeFilter) => {
  return payments.filter(p => {
    if (activeFilter === 'All Transactions') return true;
    if (activeFilter === 'Completed') return p.status === 'completed';
    if (activeFilter === 'Pending')   return p.status === 'pending';
    if (activeFilter === 'Failed')    return p.status === 'failed';
    return true;
  });
};

export const getStats = (payments) => {
  const totalCommission = payments.reduce((sum, p) => sum + parseFloat(p.commission || 0), 0);
  const thisMonth       = payments
    .filter(p => new Date(p.created_at).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + parseFloat(p.commission || 0), 0);
  const totalTxn    = payments.length;
  const completed   = payments.filter(p => p.status === 'completed').length;
  const successRate = totalTxn > 0 ? ((completed / totalTxn) * 100).toFixed(1) : '0.0';
  return { totalCommission, thisMonth, totalTxn, successRate };
};

export const formatRs = (val) => {
  if (val >= 1000000) return `Rs. ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000)    return `Rs. ${(val / 1000).toFixed(0)}K`;
  return `Rs. ${val}`;
};

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const downloadCSV = (filtered, formatDate) => {
  const headers = ['Transaction ID', 'Tenant', 'Landlord', 'Amount', 'Commission', 'Platform Fee', 'Date', 'Status'];
  const rows = filtered.map(p => [
    `#TXN-${p.id}`,
    p.tenant_name   || 'N/A',
    p.landlord_name || 'N/A',
    `Rs. ${p.amount}`,
    `Rs. ${p.commission}`,
    `Rs. ${p.platform_fee}`,
    formatDate(p.created_at),
    p.status,
  ]);
  const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'payments.csv';
  a.click();
};