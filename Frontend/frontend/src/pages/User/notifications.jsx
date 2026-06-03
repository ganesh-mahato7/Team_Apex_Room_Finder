import "../css/notification.css";
import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const allNotifications = [
  { id: 1, group: "Today",     unread: true,  type: "booking", title: "Booking Request Accepted", desc: "Your booking request for 2BHK Apartment, Baneshwor has been accepted.", time: "2 hours ago", action: "Pay Token",  actionStyle: "btn-primary" },
  { id: 2, group: "Today",     unread: true,  type: "message", title: "New Message",              desc: "You received a message from Sita Thapa",                              time: "3 hours ago", action: "View",       actionStyle: "btn-outline" },
  { id: 3, group: "Yesterday", unread: false, type: "payment", title: "Payment Successful",       desc: "Rs. 12,000 rent payment completed",                                   time: "1 day ago",   action: "Receipt",    actionStyle: "btn-outline" },
  { id: 4, group: "Yesterday", unread: false, type: "system",  title: "Profile Verified",         desc: "Your profile has been successfully verified.",                        time: "1 day ago",   action: null,         actionStyle: ""            },
];

const filters = ["All", "Unread", "Booking Updates", "Messages", "Payments", "System"];

const Notifications = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter]   = useState("All");
  const [notifications, setNotifications] = useState(allNotifications);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const filtered = notifications.filter(n => {
    if (activeFilter === "All")             return true;
    if (activeFilter === "Unread")          return n.unread;
    if (activeFilter === "Booking Updates") return n.type === "booking";
    if (activeFilter === "Messages")        return n.type === "message";
    if (activeFilter === "Payments")        return n.type === "payment";
    if (activeFilter === "System")          return n.type === "system";
    return true;
  });

  const groups       = [...new Set(filtered.map(n => n.group))];
  const unreadCount  = notifications.filter(n => n.unread).length;

  return (
    <Layout notifCount={unreadCount}>
      <div className="page-header">
        <div className="page-title"><h1>Notifications</h1><p>Stay updated with your room search activities</p></div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-outline" onClick={markAllRead}>Mark All as Read</button>
          <button className="btn btn-outline" onClick={() => navigate("/settings")}>Settings</button>
        </div>
      </div>

      <div className="notification-filters">
        {filters.map(f => (
          <button key={f} className={`filter-btn${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>
            {f === "All" ? `All (${notifications.length})` : f === "Unread" ? `Unread (${unreadCount})` : f}
          </button>
        ))}
      </div>

      <div className="notifications-container">
        {groups.length === 0 ? (
          <div className="empty-state"><span>🔔</span><p>No notifications found.</p></div>
        ) : (
          groups.map(group => (
            <div className="notification-group" key={group}>
              <h3 className="group-title">{group}</h3>
              {filtered.filter(n => n.group === group).map(n => (
                <div key={n.id} className={`notification-item${n.unread ? " unread" : ""}`}>
                  <div className="notification-content">
                    <h4>{n.title}</h4><p>{n.desc}</p>
                    <span className="notification-time">{n.time}</span>
                  </div>
                  {n.action && <button className={`btn btn-sm ${n.actionStyle}`}>{n.action}</button>}
                </div>
              ))}
            </div>
          ))
        )}
        {groups.length > 0 && (
          <div className="load-more"><button className="btn btn-outline">Load More Notifications</button></div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;