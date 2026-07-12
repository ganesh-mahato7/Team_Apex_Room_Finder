import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { STATUS_COLORS } from '../../utils/constants.js';
import { formatDate } from '../../utils/helpers.js';
import Loader from '../../components/common/Loader.jsx';

const ACTIONS = [
  { value: 'warn', label: 'Warn (no action)', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'delete_room', label: 'Delete Room', color: 'bg-orange-100 text-orange-700' },
  { value: 'ban_user', label: 'Ban User', color: 'bg-red-100 text-red-700' },
  { value: 'ban_and_delete', label: 'Ban + Delete Room', color: 'bg-red-100 text-red-900' },
];

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');
  const [modal, setModal] = useState(null);
  const [action, setAction] = useState('warn');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = () => {
    setLoading(true);
    api.get(`/admin/reports${filter !== 'all' ? `?status=${filter}` : ''}`)
      .then(res => setReports(res.data.data.reports))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, [filter]);

  const handleResolve = async () => {
    setSubmitting(true);
    try {
      await api.patch(`/admin/reports/${modal.id}/resolve`, { action, adminNote: note });
      toast.success('Report resolved');
      setModal(null); setNote(''); setAction('warn');
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex gap-2">
          {['open', 'resolved', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} capitalize`} style={{padding:'6px 14px'}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> : (
        <div className="space-y-3">
          {reports.length === 0 && <p className="text-center text-gray-400 py-10">No reports found</p>}
          {reports.map(r => (
            <div key={r.id} className="card" style={{padding:'16px'}}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                    {r.room_title && <span className="text-xs text-gray-500">Room: <span className="font-medium">{r.room_title}</span></span>}
                    {r.reported_user_name && <span className="text-xs text-gray-500">User: <span className="font-medium">{r.reported_user_name}</span></span>}
                  </div>
                  <p className="text-gray-800 text-sm">{r.reason}</p>
                  <p className="text-xs text-gray-400">By {r.reported_by_name} · {formatDate(r.created_at)}</p>
                  {r.action_taken && <p className="text-xs text-gray-500">Action: <span className="font-medium">{r.action_taken}</span></p>}
                  {r.admin_note && <p className="text-xs text-gray-500 italic">Note: {r.admin_note}</p>}
                </div>
                {r.status === 'open' && (
                  <button onClick={() => setModal(r)} className="btn btn-primary shrink-0" style={{padding:'6px 14px', fontSize:'13px'}}>
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-900 mb-1">Resolve Report</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{modal.reason}</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-gray-700">Action to take:</p>
              {ACTIONS.map(a => (
                <label key={a.value} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition ${action === a.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="action" value={a.value} checked={action === a.value} onChange={() => setAction(a.value)} />
                  <span className={`badge ${a.color}`}>{a.label}</span>
                </label>
              ))}
            </div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="input mb-4" placeholder="Admin note (optional)" />
            <div className="flex gap-2">
              <button onClick={handleResolve} disabled={submitting} className="btn btn-danger flex-1">
                {submitting ? 'Processing...' : 'Resolve'}
              </button>
              <button onClick={() => setModal(null)} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;