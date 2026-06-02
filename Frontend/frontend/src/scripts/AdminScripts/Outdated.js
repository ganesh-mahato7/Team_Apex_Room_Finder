export const filters = [
  { label: 'All',       count: 15 },
  { label: '1+ Month',  count: 8  },
  { label: '3+ Months', count: 5  },
  { label: '6+ Months', count: 2  },
];

export const outdatedListings = [
  { id: 1, title: 'Old Listing',       location: 'Patan, Lalitpur',      updated: '2 months ago', by: 'Krishna Rai', category: '1+ Month'  },
  { id: 2, title: 'Apartment Listing', location: 'Baneshwor, Kathmandu', updated: '4 months ago', by: 'Ram Sharma',  category: '3+ Months' },
  { id: 3, title: 'Flat Listing',      location: 'Bhaktapur',            updated: '7 months ago', by: 'Sita KC',     category: '6+ Months' },
];

export const getFiltered = (listings, activeFilter) =>
  activeFilter === 'All' ? listings : listings.filter(l => l.category === activeFilter);