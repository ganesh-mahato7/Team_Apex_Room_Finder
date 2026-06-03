import { useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminCss/Settings.css';
import '../../css/AdminCss/Sidebar.css';
import { FiMenu, FiBell, FiImage, FiSave, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { handleLogoChange, handleSaveLogo, handleRemoveLogo } from '../../scripts/AdminScripts/Settings.js';

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState(localStorage.getItem('adminLogo') || null);
  const [logoName,    setLogoName]    = useState('');
  const [successMsg,  setSuccessMsg]  = useState('');
  const [errorMsg,    setErrorMsg]    = useState('');
  const fileInputRef = useRef(null);

  return (
    <div className="dashboard-container">
      <Sidebar open={sidebarOpen} />
      <main className="main-content">

        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu size={24} />
            </button>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <FiBell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">
                {logoPreview
                  ? <img src={logoPreview} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }} />
                  : <FaUserCircle size={24} />
                }
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
                <FiImage size={22} />
              </div>
              <div>
                <h2>Logo Settings</h2>
                <p>Upload a custom logo for your admin panel sidebar</p>
              </div>
            </div>

            <div className="settings-card-body">

              {/* CURRENT LOGO */}
              <div className="logo-preview-section">
                <span className="settings-label">Current Logo</span>
                <div className="logo-preview-box">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Current Logo" className="logo-preview-img" />
                  ) : (
                    <div className="logo-preview-default">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <span>RoomFinder</span>
                    </div>
                  )}
                </div>
              </div>

              {/* UPLOAD */}
              <div className="upload-section">
                <span className="settings-label">Upload New Logo</span>
                <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
                  <FiUploadCloud size={40} />
                  <p className="dropzone-text">Click to upload your logo</p>
                  <p className="dropzone-hint">PNG, JPG, SVG — Max 2MB</p>
                  {logoName && <p className="dropzone-filename">Selected: {logoName}</p>}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => handleLogoChange(e, setLogoPreview, setLogoName, setErrorMsg, setSuccessMsg)}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                  style={{ display: 'none' }}
                />
              </div>

              {errorMsg   && <div className="settings-error">{errorMsg}</div>}
              {successMsg && <div className="settings-success">{successMsg}</div>}

              {/* ACTIONS */}
              <div className="settings-actions">
                <button className="btn btn-primary" onClick={() => handleSaveLogo(logoPreview, setErrorMsg, setSuccessMsg)}>
                  <FiSave size={16} /> Save Logo
                </button>
                <button className="btn btn-outline" onClick={() => handleRemoveLogo(setLogoPreview, setLogoName, setSuccessMsg, setErrorMsg)}>
                  <FiTrash2 size={16} /> Remove Logo
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