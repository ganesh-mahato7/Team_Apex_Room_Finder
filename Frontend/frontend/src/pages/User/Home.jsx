import { useState, useEffect } from 'react';
import { getRooms } from '../../services/roomService.js';
import RoomList from '../../components/room/RoomList.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { ROOM_TYPES } from '../../utils/constants.js';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ location: '', min_price: '', max_price: '', room_type: '' });

  const fetchRooms = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await getRooms(params);
      const { rooms: data, total, pages } = res.data.data;
      setRooms(data);
      setPagination({ page, pages, total });
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(1);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <div
        className="text-white py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #C9662D 0%, #A8511F 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold mb-3">Find Your Perfect Room</h1>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>Browse verified rooms from trusted landlords</p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })}
              placeholder="Search by location..."
              className="input flex-1"
              style={{ color: 'var(--text)' }}
            />
            <button
              type="submit"
              className="font-semibold px-6 py-2 rounded-lg transition"
              style={{ background: 'var(--white)', color: 'var(--primary-dark)' }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b py-3 px-4" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
          <select
            value={filters.room_type}
            onChange={e => setFilters({ ...filters, room_type: e.target.value })}
            className="rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            style={{ border: '1px solid var(--border)' }}
          >
            <option value="">All Types</option>
            {ROOM_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>
          <input
            value={filters.min_price}
            onChange={e => setFilters({ ...filters, min_price: e.target.value })}
            placeholder="Min price" type="number"
            className="rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none"
            style={{ border: '1px solid var(--border)' }}
          />
          <input
            value={filters.max_price}
            onChange={e => setFilters({ ...filters, max_price: e.target.value })}
            placeholder="Max price" type="number"
            className="rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none"
            style={{ border: '1px solid var(--border)' }}
          />
          <button
            onClick={() => { setFilters({ location: '', min_price: '', max_price: '', room_type: '' }); fetchRooms(1); }}
            className="text-sm transition"
            style={{ color: 'var(--muted)' }}
          >
            Clear
          </button>
          <button onClick={() => fetchRooms(1)} className="btn btn-primary text-sm" style={{ padding: '6px 16px' }}>Apply</button>
          <span className="ml-auto text-sm" style={{ color: 'var(--muted)' }}>{pagination.total} rooms found</span>
        </div>
      </div>

      {/* Rooms */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <RoomList rooms={rooms} loading={loading} />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => fetchRooms(p)}
                className="w-9 h-9 rounded-lg text-sm font-medium transition"
                style={
                  p === pagination.page
                    ? { background: 'var(--primary)', color: 'white', border: 'none' }
                    : { background: 'var(--white)', color: 'var(--muted)', border: '1px solid var(--border)' }
                }
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;