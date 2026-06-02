import { useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Settings.css';
import '../../css/AdminCss/Sidebar.css';
import { handleLogoChange, handleSaveLogo, handleRemoveLogo } from '../../scripts/AdminScripts/Settings.js';

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [logoPreview, setLogoPreview] = useState(
    localStorage.getItem('adminLogo') || null
  );
  const [logoName, setLogoName]     = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');
  const fileInputRef = useRef(null);

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-dot"></span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="admin-info">
                <span className="admin-name">Admin User</span>
                <span className="admin-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="page-header">
            <div className="page-title">
              <h1>Settings</h1>
              <p>Manage your admin panel preferences</p>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div>
                <h2>Logo Settings</h2>
                <p>Upload a custom logo for your admin panel sidebar</p>
              </div>
            </div>

            <div className="settings-card-body">

              <div className="logo-preview-section">
                <span className="settings-label">Current Logo</span>
                <div className="logo-preview-box">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Current Logo" className="logo-preview-img" />
                  ) : (
                    <div className="logo-preview-default">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <span>RoomFinder</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="upload-section">
                <span className="settings-label">Upload New Logo</span>
                <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"></polyline>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                  </svg>
                  <p className="dropzone-text">Click to upload your logo</p>
                  <p className="dropzone-hint">PNG, JPG, SVG — Max 2MB</p>
                  {logoName && <p className="dropzone-filename">Selected: {logoName}</p>}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleLogoChange(e, setLogoPreview, setLogoName, setErrorMsg, setSuccessMsg)}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                  style={{ display: 'none' }}
                />
              </div>

              {errorMsg   && <div className="settings-error">{errorMsg}</div>}
              {successMsg && <div className="settings-success">{successMsg}</div>}

              <div className="settings-actions">
                <button className="btn btn-primary" onClick={() => handleSaveLogo(logoPreview, setErrorMsg, setSuccessMsg)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Logo
                </button>
                <button className="btn btn-outline" onClick={() => handleRemoveLogo(setLogoPreview, setLogoName, setSuccessMsg, setErrorMsg)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Remove Logo
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;