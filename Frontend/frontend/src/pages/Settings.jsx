import Sidebar from "../components/Sidebar";
import "../css/SettingStyle.css";
import { useState } from "react";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    emailBooking: true,
    emailMessages: true,
    emailVisits: false,
    smsBooking: true,
    smsMessages: false,
    smsVisits: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showContact: false,
    allowMessages: true,
  });

  const [preferences, setPreferences] = useState({
    language: "English",
    currency: "NPR",
    theme: "Light",
  });

  const toggleNotification = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const togglePrivacy = (key) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">

        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
            <div className="search-box">
              <input type="text" placeholder="Search settings..." />
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn">🔔</button>
            <button className="header-btn">
              💬 <span className="message-count">4</span>
            </button>
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

          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1>Settings</h1>
              <p>Manage your account preferences and configurations.</p>
            </div>
          </div>

          <div className="settings-wrapper">

            {/* Notification Settings */}
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="settings-icon">🔔</span>
                <h3>Notification Settings</h3>
              </div>
              <div className="settings-card-body">

                <p className="settings-group-label">EMAIL NOTIFICATIONS</p>

                {[
                  { key: "emailBooking",  label: "Booking Requests", desc: "Get notified when someone books a visit" },
                  { key: "emailMessages", label: "New Messages",      desc: "Receive email alerts for new messages"  },
                  { key: "emailVisits",   label: "Visit Reminders",   desc: "Email reminders before scheduled visits"},
                ].map(({ key, label, desc }) => (
                  <div className="settings-row" key={key}>
                    <div className="settings-row-info">
                      <p className="settings-row-label">{label}</p>
                      <p className="settings-row-desc">{desc}</p>
                    </div>
                    <button
                      className={`toggle-btn ${notifications[key] ? "active" : ""}`}
                      onClick={() => toggleNotification(key)}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                ))}

                <hr className="settings-divider" />
                <p className="settings-group-label">SMS NOTIFICATIONS</p>

                {[
                  { key: "smsBooking",  label: "Booking Updates", desc: "SMS alerts for booking status changes" },
                  { key: "smsMessages", label: "Message Alerts",   desc: "Get SMS when you receive a message"   },
                  { key: "smsVisits",   label: "Visit Reminders",  desc: "SMS reminders before your visits"     },
                ].map(({ key, label, desc }) => (
                  <div className="settings-row" key={key}>
                    <div className="settings-row-info">
                      <p className="settings-row-label">{label}</p>
                      <p className="settings-row-desc">{desc}</p>
                    </div>
                    <button
                      className={`toggle-btn ${notifications[key] ? "active" : ""}`}
                      onClick={() => toggleNotification(key)}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                ))}

              </div>
            </div>

            {/* Privacy Settings */}
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="settings-icon">🔒</span>
                <h3>Privacy Settings</h3>
              </div>
              <div className="settings-card-body">
                {[
                  { key: "showProfile",   label: "Public Profile",        desc: "Allow landlords to view your profile"      },
                  { key: "showContact",   label: "Show Contact Info",      desc: "Display your phone number to landlords"    },
                  { key: "allowMessages", label: "Allow Direct Messages",  desc: "Let verified landlords message you"        },
                ].map(({ key, label, desc }) => (
                  <div className="settings-row" key={key}>
                    <div className="settings-row-info">
                      <p className="settings-row-label">{label}</p>
                      <p className="settings-row-desc">{desc}</p>
                    </div>
                    <button
                      className={`toggle-btn ${privacy[key] ? "active" : ""}`}
                      onClick={() => togglePrivacy(key)}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="settings-icon">⚙️</span>
                <h3>Preferences</h3>
              </div>
              <div className="settings-card-body">
                {[
                  { key: "language", label: "Language",     options: ["English", "Nepali"]       },
                  { key: "currency", label: "Currency",     options: ["NPR", "USD", "INR"]        },
                  { key: "theme",    label: "Display Theme",options: ["Light", "Dark", "System"]  },
                ].map(({ key, label, options }) => (
                  <div className="settings-row" key={key}>
                    <p className="settings-row-label">{label}</p>
                    <select
                      className="settings-select"
                      value={preferences[key]}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="settings-icon">🔑</span>
                <h3>Change Password</h3>
              </div>
              <div className="settings-card-body">
                {[
                  { label: "Current Password", placeholder: "Enter current password" },
                  { label: "New Password",      placeholder: "Enter new password"     },
                  { label: "Confirm Password",  placeholder: "Re-enter new password"  },
                ].map(({ label, placeholder }) => (
                  <div className="settings-field" key={label}>
                    <label className="settings-field-label">{label}</label>
                    <input
                      type="password"
                      placeholder={placeholder}
                      className="settings-input"
                    />
                  </div>
                ))}
                <div className="settings-action-right">
                  <button className="btn-settings-primary">Update Password</button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-card danger-card">
              <div className="settings-card-header danger-header">
                <span className="settings-icon">⚠️</span>
                <h3 className="danger-title">Danger Zone</h3>
              </div>
              <div className="settings-card-body">

                <div className="settings-row">
                  <div className="settings-row-info">
                    <p className="settings-row-label">Deactivate Account</p>
                    <p className="settings-row-desc">
                      Temporarily disable your account. You can reactivate anytime.
                    </p>
                  </div>
                  <button className="btn-warning">Deactivate</button>
                </div>

                <hr className="settings-divider danger-divider" />

                <div className="settings-row">
                  <div className="settings-row-info">
                    <p className="settings-row-label">Delete Account</p>
                    <p className="settings-row-desc">
                      Permanently delete your account and all data. This cannot be undone.
                    </p>
                  </div>
                  <button className="btn-danger">Delete Account</button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;