import "../css/SavedListing.css";
import Layout from "../components/Layout";

const listings = [
  { cls: "room", type: "Room",      title: "Cozy Room in Thamel",  loc: "Thamel, Kathmandu",  price: "Rs. 15,000/month" },
  { cls: "apt",  type: "Apartment", title: "Modern Flat in Patan", loc: "Patan, Lalitpur",    price: "Rs. 25,000/month" },
  { cls: "flat", type: "Studio",    title: "Studio in Bhaktapur",  loc: "Bhaktapur",          price: "Rs. 12,000/month" },
  { cls: "room", type: "Room",      title: "Luxury Apartment",     loc: "Boudha, Kathmandu",  price: "Rs. 40,000/month" },
];

const SavedListing = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-title"><h1>Saved Listings</h1><p>Your favorite rooms and properties</p></div>
      </div>
      <div className="listings-grid">
        {listings.map(({ cls, type, title, loc, price }) => (
          <div className="listing-card" key={title}>
            <div className={`listing-image ${cls}`} />
            <button className="save-btn saved">❤️</button>
            <div className="listing-details">
              <span className="listing-type">{type}</span>
              <h4>{title}</h4>
              <p>📍 {loc}</p>
              <div className="listing-footer">
                <div className="listing-price">{price}</div>
                <button className="btn btn-primary">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default SavedListing;