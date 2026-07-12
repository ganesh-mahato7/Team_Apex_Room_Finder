import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext.jsx';
import { getChatMessages } from '../../services/chatService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import Loader from '../common/Loader.jsx';
import { getInitials } from '../../utils/helpers.js';

const COLORS = { primary: '#C9662D', text: '#3D2B1F', muted: '#8A7B6C', border: '#E8DCC8', bg: '#FAF3E7', white: '#FFFFFF' };

const ChatWindow = ({ chatId, chatInfo }) => {
  const { user } = useAuth();
  const { messages, setMessages, joinChat, sendMessage, sendTyping, sendStopTyping, typingUsers } = useChat();
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getChatMessages(chatId);
        setMessages(res.data.data.messages);
        joinChat(chatId);
      } catch { setMessages([]); }
      finally { setLoading(false); }
    };
    load();
  }, [chatId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const otherName = chatInfo ? (user?.role === 'landlord' ? chatInfo.user_name : chatInfo.landlord_name) : '';

  if (loading) return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {chatInfo && (
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, background: COLORS.white, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#C9662D,#A8511F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
            {getInitials(otherName)}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: COLORS.text, margin: 0, fontSize: '14px' }}>{otherName}</p>
            <p style={{ fontSize: '12px', color: COLORS.primary, margin: 0, fontWeight: 600 }}>{chatInfo.room_title}</p>
          </div>
        </div>
      )}
      <MessageList messages={messages} currentUserId={user?.id} typingUsers={typingUsers} />
      <div ref={bottomRef} />
      <MessageInput onSend={(content) => sendMessage(chatId, content)} onTyping={() => sendTyping(chatId)} onStopTyping={() => sendStopTyping(chatId)} />
    </div>
  );
};

export default ChatWindow;