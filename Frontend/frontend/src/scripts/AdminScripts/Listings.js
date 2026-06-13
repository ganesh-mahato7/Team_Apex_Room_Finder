// Listings uses static data for now — no API change needed
export const filters = [
  { label: 'All',       count: 512 },
  { label: 'Room',      count: 234 },
  { label: 'Apartment', count: 178 },
  { label: 'Flat',      count: 100 },
];

export const listings = [
  { id: 1, title: 'Cozy Room in Kathmandu',   location: 'Thamel, Kathmandu',       price: 'Rs. 8,000/month',  by: 'Sita Thapa',    listed: 'Mar 10, 2026', type: 'Room'      },
  { id: 2, title: '2BHK Apartment, Lalitpur', location: 'Pulchowk, Lalitpur',      price: 'Rs. 22,000/month', by: 'Ram Sharma',    listed: 'Mar 8, 2026',  type: 'Apartment' },
  { id: 3, title: 'Flat in Bhaktapur',        location: 'Suryabinayak, Bhaktapur', price: 'Rs. 15,000/month', by: 'Hari Prasad',   listed: 'Mar 5, 2026',  type: 'Flat'      },
  { id: 4, title: 'Single Room, Baneshwor',   location: 'Baneshwor, Kathmandu',    price: 'Rs. 7,500/month',  by: 'Maya KC',       listed: 'Mar 3, 2026',  type: 'Room'      },
  { id: 5, title: '3BHK Apartment, Lazimpat', location: 'Lazimpat, Kathmandu',     price: 'Rs. 35,000/month', by: 'Ganesh Gurung', listed: 'Feb 28, 2026', type: 'Apartment' },
  { id: 6, title: 'Furnished Flat, Patan',    location: 'Mangalbazar, Patan',      price: 'Rs. 18,000/month', by: 'Anup Shrestha', listed: 'Feb 25, 2026', type: 'Flat'      },
];

export const getFiltered = (listings, activeFilter) =>
  activeFilter === 'All' ? listings : listings.filter(l => l.type === activeFilter);