import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaComments, FaSearch } from 'react-icons/fa';
import { getMyChats } from '../../services/chatService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ChatProvider } from '../../context/ChatContext.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getInitials } from '../../utils/helpers.js';

const COLORS = { primary: '#C9662D', text: '#3D2B1F', muted: '#8A7B6C', border: '#E8DCC8', bg: '#FAF3E7', white: '#FFFFFF' };

const MyChats = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getMyChats()
      .then(res => {
        const data = res.data.data.chats;
        setChats(data);
        if (location.state?.chatId) {
          const found = data.find(c => c.id === location.state.chatId);
          if (found) setActiveChat(found);
        } else if (data.length > 0) {
          setActiveChat(data[0]);
        }
      })
      .catch(() => setChats([]))
      .finally(() => setLoading(false));
  }, []);

  const chatLabel = (chat) => user?.role === 'landlord' ? chat.user_name : chat.landlord_name;

  const filteredChats = chats.filter(c =>
    chatLabel(c)?.toLowerCase().includes(search.toLowerCase()) ||
    c.room_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ChatProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
        <Navbar />
        <div style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '24px', display: 'flex', gap: '16px' }}>

          {/* Sidebar */}
          <div style={{ width: '300px', flexShrink: 0, background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 16px 12px' }}>
              <h2 style={{ fontWeight: 800, color: COLORS.text, fontSize: '17px', margin: '0 0 12px' }}>Messages</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '9999px', padding: '7px 12px' }}>
                <FaSearch style={{ fontSize: '11px', color: COLORS.muted, flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: COLORS.text, width: '100%' }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>
            ) : filteredChats.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '32px 16px', textAlign: 'center' }}>
                <FaComments style={{ fontSize: '26px', color: COLORS.border }} />
                <p style={{ fontSize: '13px', color: COLORS.muted, margin: 0 }}>
                  {chats.length === 0 ? 'No conversations yet' : 'No matches found'}
                </p>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredChats.map(chat => {
                  const active = activeChat?.id === chat.id;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '14px 16px', border: 'none', cursor: 'pointer',
                        background: active ? '#FBF0E8' : 'transparent',
                        borderLeft: active ? `3px solid ${COLORS.primary}` : '3px solid transparent',
                        borderBottom: `1px solid ${COLORS.border}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = COLORS.bg; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#C9662D,#A8511F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', fontWeight: 700, flexShrink: 0 }}>
                          {getInitials(chatLabel(chat))}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontWeight: 700, fontSize: '14px', color: COLORS.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chatLabel(chat)}
                          </p>
                          <p style={{ fontSize: '12px', color: COLORS.primary, margin: '1px 0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chat.room_title}
                          </p>
                          {chat.last_message && (
                            <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {chat.last_message}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {activeChat ? (
              <ChatWindow chatId={activeChat.id} chatInfo={activeChat} />
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: COLORS.muted }}>
                <FaComments style={{ fontSize: '36px', color: COLORS.border }} />
                <p style={{ fontSize: '14px', margin: 0 }}>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default MyChats;