import "../css/profile.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const Profile = () => {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="main-content">

        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
            <h2>My Profile</h2>
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

          <div className="profile-header-card">
            <div className="profile-cover"></div>

            <div className="profile-info">

              <div className="profile-avatar-large">
                <span>RS</span>
                <button className="avatar-edit-btn">📷</button>
              </div>

              <div className="profile-details">
                <h1>Ram Sharma</h1>

                <p className="profile-role">Room Seeker</p>

                <div className="profile-meta">
                  <span className="meta-item">
                    📍 Kathmandu, Nepal
                  </span>

                  <span className="meta-item">
                    📅 Member since Jan 2026
                  </span>

                  <span className="meta-item verified">
                    ✔ Verified
                  </span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn btn-primary">
                  Edit Profile
                </button>
              </div>

            </div>
          </div>

          <div className="profile-content-grid">

            <div className="profile-section">
              <h3>Personal Information</h3>

              <div className="info-grid">

                <div className="info-item">
                  <label>Full Name</label>
                  <span>Ram Sharma</span>
                </div>

                <div className="info-item">
                  <label>Email</label>
                  <span>ram@email.com</span>
                </div>

                <div className="info-item">
                  <label>Phone</label>
                  <span>+977 98XXXXXXXX</span>
                </div>

              </div>
            </div>

            <div className="profile-section">
              <h3>Address</h3>

              <div className="info-item">
                <label>Current Address</label>
                <span>Kathmandu, Nepal</span>
              </div>
            </div>

            <div className="profile-section">
              <h3>Account Security</h3>

              <div className="security-item">
                <p>Password last changed 30 days ago</p>

                <button className="btn btn-outline">
                  Change Password
                </button>
              </div>
            </div>

          </div>

          <div className="danger-zone">
            <h3>Danger Zone</h3>

            <button className="btn btn-outline danger">
              Deactivate
            </button>

            <button className="btn btn-danger">
              Delete Account
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;