import "../css/profile.css";
import Layout from "../components/Layout";

const Profile = () => {
  return (
    <Layout>
      <div className="profile-header-card">
        <div className="profile-cover" />
        <div className="profile-info">
          <div className="profile-avatar-large"><span>RS</span><button className="avatar-edit-btn">📷</button></div>
          <div className="profile-details">
            <h1>Ram Sharma</h1>
            <p className="profile-role">Room Seeker</p>
            <div className="profile-meta">
              <span className="meta-item">📍 Kathmandu, Nepal</span>
              <span className="meta-item">📅 Member since Jan 2026</span>
              <span className="meta-item verified">✔ Verified</span>
            </div>
          </div>
          <div className="profile-actions"><button className="btn btn-primary">Edit Profile</button></div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            {[["Full Name","Ram Sharma"],["Email","ram@email.com"],["Phone","+977 98XXXXXXXX"]].map(([l,v]) => (
              <div className="info-item" key={l}><label>{l}</label><span>{v}</span></div>
            ))}
          </div>
        </div>
        <div className="profile-section">
          <h3>Address</h3>
          <div className="info-item"><label>Current Address</label><span>Kathmandu, Nepal</span></div>
        </div>
        <div className="profile-section">
          <h3>Account Security</h3>
          <div className="security-item">
            <p>Password last changed 30 days ago</p>
            <button className="btn btn-outline">Change Password</button>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <button className="btn btn-outline danger">Deactivate</button>
        <button className="btn btn-danger">Delete Account</button>
      </div>
    </Layout>
  );
};

export default Profile;