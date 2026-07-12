import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyChats } from '../../services/chatService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ChatProvider } from '../../context/ChatContext.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getInitials } from '../../utils/helpers.js';

const MyChats = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

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

  return (
    <ChatProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-6 gap-4">

          {/* Sidebar */}
          <div style={{width:'288px', flexShrink:0}} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Messages</h2>
            </div>
            {loading ? (
              <div className="flex-1 flex items-center justify-center"><Loader /></div>
            ) : chats.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400 p-4 text-center">
                No conversations yet
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {chats.map(chat => (
                  <button key={chat.id} onClick={() => setActiveChat(chat)}
                    className={`w-full text-left p-4 transition ${activeChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div style={{width:'40px', height:'40px', flexShrink:0}}
                        className="rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(chatLabel(chat))}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-800 line-clamp-1">{chatLabel(chat)}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{chat.room_title}</p>
                        {chat.last_message && (
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{chat.last_message}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            {activeChat ? (
              <ChatWindow chatId={activeChat.id} chatInfo={activeChat} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default MyChats;