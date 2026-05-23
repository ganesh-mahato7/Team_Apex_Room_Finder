import "../css/SavedListing.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const SavedListing = () => {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
          </div>

          <div className="header-right">
            <button className="header-btn">🔔</button>
            <button className="header-btn">💬</button>

            <div className="user-profile">
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <span className="user-name">Ram Sharma</span>
                <span className="user-role">Room Seeker</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Saved Listings</h1>
            <p>Your favorite rooms and properties</p>
          </div>

          <div className="listings-grid">

            <div className="listing-card">
              <div className="listing-image room"></div>
              <button className="save-btn saved">❤️</button>

              <div className="listing-details">
                <span className="listing-type">Room</span>
                <h4>Cozy Room in Thamel</h4>
                <p>📍 Thamel, Kathmandu</p>

                <div className="listing-footer">
                  <div className="listing-price">Rs. 15,000/month</div>
                  <button className="btn btn-primary">View</button>
                </div>
              </div>
            </div>

            <div className="listing-card">
              <div className="listing-image apt"></div>
              <button className="save-btn saved">❤️</button>

              <div className="listing-details">
                <span className="listing-type">Apartment</span>
                <h4>Modern Flat in Patan</h4>
                <p>📍 Patan, Lalitpur</p>

                <div className="listing-footer">
                  <div className="listing-price">Rs. 25,000/month</div>
                  <button className="btn btn-primary">View</button>
                </div>
              </div>
            </div>

            <div className="listing-card">
              <div className="listing-image flat"></div>
              <button className="save-btn saved">❤️</button>

              <div className="listing-details">
                <span className="listing-type">Studio</span>
                <h4>Studio in Bhaktapur</h4>
                <p>📍 Bhaktapur</p>

                <div className="listing-footer">
                  <div className="listing-price">Rs. 12,000/month</div>
                  <button className="btn btn-primary">View</button>
                </div>
              </div>
            </div>

            <div className="listing-card">
              <div className="listing-image room"></div>
              <button className="save-btn saved">❤️</button>

              <div className="listing-details">
                <span className="listing-type">Room</span>
                <h4>Luxury Apartment</h4>
                <p>📍 Boudha, Kathmandu</p>

                <div className="listing-footer">
                  <div className="listing-price">Rs. 40,000/month</div>
                  <button className="btn btn-primary">View</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SavedListing;