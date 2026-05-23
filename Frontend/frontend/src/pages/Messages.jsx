import "../css/Messages.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const Messages = () => {
  return (
    <div className="dashboard-container">

      {/* ✅ Reusable Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="main-content">

        {/* Header */}
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

        {/* Content */}
        <div className="dashboard-content">

          <div className="page-header">
            <div className="page-title">
              <h1>Messages</h1>
              <p>Communicate with landlords and property managers</p>
            </div>
          </div>

          <div className="messages-container">

            {/* Left - Threads */}
            <div className="messages-list">

              <div className="message-thread unread">
                <div className="thread-avatar">KR</div>
                <div className="thread-info">
                  <h4>Krishna Rai</h4>
                  <p>Hi! Are you still interested in the room?</p>
                  <span className="thread-time">2 hours ago</span>
                </div>
              </div>

              <div className="message-thread">
                <div className="thread-avatar">ST</div>
                <div className="thread-info">
                  <h4>Sita Thapa</h4>
                  <p>The flat is available from 15th March...</p>
                  <span className="thread-time">Yesterday</span>
                </div>
              </div>

              <div className="message-thread">
                <div className="thread-avatar">RM</div>
                <div className="thread-info">
                  <h4>Ramesh Magar</h4>
                  <p>Thank you for booking! Here are the details...</p>
                  <span className="thread-time">Mar 15</span>
                </div>
              </div>

            </div>

            {/* Right - Chat */}
            <div className="message-detail">

              <div className="message-detail-header">
                <h3>Krishna Rai</h3>
                <p>Landlord • Cozy Room in Thamel</p>
              </div>

              <div className="chat-content">

                <div className="message-box other">
                  <p>Hi! Are you still interested in the room?</p>
                  <span>2 hours ago</span>
                </div>

                <div className="message-box other">
                  <p>Can you visit this Saturday at 2 PM?</p>
                  <span>2 hours ago</span>
                </div>

                <div className="message-box mine">
                  <p>Yes, I'm still interested!</p>
                  <span>1 hour ago</span>
                </div>

                <div className="message-box mine">
                  <p>Saturday works for me. See you then!</p>
                  <span>1 hour ago</span>
                </div>

              </div>

              <div className="message-input-area">
                <input type="text" placeholder="Type your message..." />
                <button className="btn btn-primary btn-sm">Send</button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Messages;