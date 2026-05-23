import "../css/RecentlyViewed.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const RecentlyViewed = () => {
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

            <button className="header-btn">
              💬 <span className="message-count">4</span>
            </button>

            <div className="user-profile">
              <div className="user-avatar">RS</div>

              <div className="user-info">
                <span className="user-name">Ram Sharma</span>
                <span className="user-role">Room Seeker</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Recently Viewed</h1>
              <p>Listings you've recently browsed</p>
            </div>
          </div>

          <div className="section">

            <div className="section-header">
              <h3>Your Browse History</h3>
            </div>

            <div className="recent-item">
              <div className="recent-image room"></div>

              <div className="recent-info">
                <h4>Cozy Room in Thamel</h4>
                <p>Thamel, Kathmandu</p>
                <span>250 sq ft • 1 bed • Shared Bath</span>
              </div>

              <div className="recent-price">
                Rs. 15,000/mo
              </div>

              <span className="recent-time">
                Viewed 2 hours ago
              </span>

              <button className="save-btn">🤍</button>

              <button className="btn btn-sm btn-primary">
                View
              </button>
            </div>

            <div className="recent-item">
              <div className="recent-image apt"></div>

              <div className="recent-info">
                <h4>Modern Flat in Patan</h4>
                <p>Patan, Lalitpur</p>
                <span>450 sq ft • 2 bed • Attached Bath</span>
              </div>

              <div className="recent-price">
                Rs. 25,000/mo
              </div>

              <span className="recent-time">
                Viewed Yesterday
              </span>

              <button className="save-btn">🤍</button>

              <button className="btn btn-sm btn-primary">
                View
              </button>
            </div>

            <div className="recent-item">
              <div className="recent-image flat"></div>

              <div className="recent-info">
                <h4>Studio in Bhaktapur</h4>
                <p>Bhaktapur</p>
                <span>300 sq ft • Studio • Private Bath</span>
              </div>

              <div className="recent-price">
                Rs. 12,000/mo
              </div>

              <span className="recent-time">
                Viewed Mar 14
              </span>

              <button className="save-btn">🤍</button>

              <button className="btn btn-sm btn-primary">
                View
              </button>
            </div>

            <div className="recent-item">
              <div className="recent-image room"></div>

              <div className="recent-info">
                <h4>Luxury Apartment</h4>
                <p>Boudha, Kathmandu</p>
                <span>600 sq ft • 3 bed • 2 Baths</span>
              </div>

              <div className="recent-price">
                Rs. 40,000/mo
              </div>

              <span className="recent-time">
                Viewed Mar 12
              </span>

              <button className="save-btn">🤍</button>

              <button className="btn btn-sm btn-primary">
                View
              </button>
            </div>

            <div className="recent-item">
              <div className="recent-image apt"></div>

              <div className="recent-info">
                <h4>Spacious Room</h4>
                <p>Kathmandu</p>
                <span>350 sq ft • 1 bed • Attached Bath</span>
              </div>

              <div className="recent-price">
                Rs. 18,000/mo
              </div>

              <span className="recent-time">
                Viewed Mar 10
              </span>

              <button className="save-btn">🤍</button>

              <button className="btn btn-sm btn-primary">
                View
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default RecentlyViewed;