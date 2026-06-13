const API = 'http://localhost:5000/api/v1';

export const fetchAnalytics = (setStats, setLoading) => {
  fetch(`${API}/users/analytics`)
    .then(res => res.json())
    .then(data => {
      setStats(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
};

export const mergeMonthlyData = (stats) => {
  if (!stats) return [];
  const map = {};

  (stats.usersByMonth || []).forEach(r => {
    map[r.month] = { month: r.month, Users: parseInt(r.count) };
  });

  (stats.listingsByMonth || []).forEach(r => {
    if (!map[r.month]) map[r.month] = { month: r.month };
    map[r.month].Listings = parseInt(r.count);
  });

  (stats.revenueByMonth || []).forEach(r => {
    if (!map[r.month]) map[r.month] = { month: r.month };
    map[r.month].Revenue = parseFloat(r.total);
  });

  return Object.values(map);
};

export const formatRevenue = (val) => {
  if (val >= 1000000) return `Rs. ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000)    return `Rs. ${(val / 1000).toFixed(0)}K`;
  return `Rs. ${val}`;
};

export const downloadReport = (data, monthKey, valueKey, filename, isRevenue = false) => {
  const content = (data || [])
    .map(r => isRevenue
      ? `${r[monthKey]}: Rs. ${r[valueKey]}`
      : `${r[monthKey]}: ${r[valueKey]} ${valueKey}`
    )
    .join('\n');

  const blob = new Blob([content || 'No data'], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};