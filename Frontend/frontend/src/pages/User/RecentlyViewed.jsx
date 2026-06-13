import "../css/RecentlyViewed.css";
import Layout from "../components/Layout";

const items = [
  { title: "Cozy Room in Thamel",  loc: "Thamel, Kathmandu",  details: "250 sq ft • 1 bed • Shared Bath",   price: "Rs. 15,000/mo", time: "2 hours ago", cls: "room" },
  { title: "Modern Flat in Patan", loc: "Patan, Lalitpur",    details: "450 sq ft • 2 bed • Attached Bath", price: "Rs. 25,000/mo", time: "Yesterday",   cls: "apt"  },
  { title: "Studio in Bhaktapur",  loc: "Bhaktapur",          details: "300 sq ft • Studio • Private Bath", price: "Rs. 12,000/mo", time: "Mar 14",      cls: "flat" },
  { title: "Luxury Apartment",     loc: "Boudha, Kathmandu",  details: "600 sq ft • 3 bed • 2 Baths",       price: "Rs. 40,000/mo", time: "Mar 12",      cls: "room" },
  { title: "Spacious Room",        loc: "Kathmandu",          details: "350 sq ft • 1 bed • Attached Bath", price: "Rs. 18,000/mo", time: "Mar 10",      cls: "apt"  },
];

const RecentlyViewed = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-title"><h1>Recently Viewed</h1><p>Listings you've recently browsed</p></div>
      </div>
      <div className="section">
        <div className="section-header"><h3>Your Browse History</h3></div>
        {items.map(({ title, loc, details, price, time, cls }) => (
          <div className="recent-item" key={title}>
            <div className={`recent-image ${cls}`} />
            <div className="recent-info"><h4>{title}</h4><p>{loc}</p><span>{details}</span></div>
            <div className="recent-price">{price}</div>
            <span className="recent-time">Viewed {time}</span>
            <button className="save-btn">🤍</button>
            <button className="btn btn-sm btn-primary">View</button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default RecentlyViewed;