import { useState } from 'react';
import { ROOM_TYPES } from '../../utils/constants.js';

const AMENITIES_OPTIONS = ['WiFi', 'Parking', 'Kitchen', 'Laundry', 'AC', 'Heating', 'TV', 'Gym', 'Security'];

const RoomForm = ({ initialData = {}, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price || '',
    location: initialData.location || '',
    address: initialData.address || '',
    room_type: initialData.room_type || 'single',
    amenities: typeof initialData.amenities === 'string' ? JSON.parse(initialData.amenities) : initialData.amenities || [],
    rules: typeof initialData.rules === 'string' ? JSON.parse(initialData.rules).join('\n') : (initialData.rules || []).join('\n'),
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAmenity = (a) => {
    setForm({ ...form, amenities: form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'amenities') fd.append(k, JSON.stringify(v));
      else if (k === 'rules') fd.append(k, JSON.stringify(v.split('\n').filter(Boolean)));
      else fd.append(k, v);
    });
    images.forEach((img) => fd.append('images', img));
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input name="title" value={form.title} onChange={handleChange} required className="input" placeholder="Cozy single room near city center" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input" placeholder="Describe your room..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price / month (NPR)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required className="input" placeholder="8000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select name="room_type" value={form.room_type} onChange={handleChange} className="input capitalize">
            {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location (city/area)</label>
        <input name="location" value={form.location} onChange={handleChange} required className="input" placeholder="Pokhara, Lakeside" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
        <input name="address" value={form.address} onChange={handleChange} required className="input" placeholder="Ward 6, Baidam, Pokhara" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_OPTIONS.map(a => (
            <button type="button" key={a} onClick={() => toggleAmenity(a)}
              className={`px-3 py-1 rounded-full text-sm border transition ${form.amenities.includes(a) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rules (one per line)</label>
        <textarea name="rules" value={form.rules} onChange={handleChange} rows={3} className="input" placeholder="No smoking&#10;No pets" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images (max 6)</label>
        <input type="file" accept="image/*" multiple onChange={e => setImages([...e.target.files])} className="block w-full text-sm text-gray-500" />
        {images.length > 0 && <p className="text-xs text-gray-500 mt-1">{images.length} image(s) selected</p>}
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary btn-full">
        {loading ? 'Submitting...' : 'Submit Room'}
      </button>
    </form>
  );
};

export default RoomForm;