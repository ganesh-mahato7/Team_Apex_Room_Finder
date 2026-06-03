import "../css/Messages.css";
import Layout from "../components/Layout";

const Messages = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-title"><h1>Messages</h1><p>Communicate with landlords and property managers</p></div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {[
            { initials: "KR", name: "Krishna Rai",  preview: "Hi! Are you still interested in the room?", time: "2 hours ago", unread: true  },
            { initials: "ST", name: "Sita Thapa",   preview: "The flat is available from 15th March...",   time: "Yesterday",   unread: false },
            { initials: "RM", name: "Ramesh Magar", preview: "Thank you for booking! Here are the details...", time: "Mar 15", unread: false },
          ].map(({ initials, name, preview, time, unread }) => (
            <div className={`message-thread ${unread ? "unread" : ""}`} key={name}>
              <div className="thread-avatar">{initials}</div>
              <div className="thread-info">
                <h4>{name}</h4><p>{preview}</p><span className="thread-time">{time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="message-detail">
          <div className="message-detail-header"><h3>Krishna Rai</h3><p>Landlord • Cozy Room in Thamel</p></div>
          <div className="chat-content">
            <div className="message-box other"><p>Hi! Are you still interested in the room?</p><span>2 hours ago</span></div>
            <div className="message-box other"><p>Can you visit this Saturday at 2 PM?</p><span>2 hours ago</span></div>
            <div className="message-box mine"><p>Yes, I'm still interested!</p><span>1 hour ago</span></div>
            <div className="message-box mine"><p>Saturday works for me. See you then!</p><span>1 hour ago</span></div>
          </div>
          <div className="message-input-area">
            <input type="text" placeholder="Type your message..." />
            <button className="btn btn-primary btn-sm">Send</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;