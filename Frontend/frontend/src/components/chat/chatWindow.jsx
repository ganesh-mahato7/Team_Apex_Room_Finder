import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext.jsx';
import { getChatMessages } from '../../services/chatService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import Loader from '../common/Loader.jsx';

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

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="flex flex-col h-full">
      {chatInfo && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <p className="font-semibold text-gray-800">{chatInfo.room_title}</p>
          <p className="text-sm text-gray-500">{user?.role === 'landlord' ? chatInfo.user_name : chatInfo.landlord_name}</p>
        </div>
      )}
      <MessageList messages={messages} currentUserId={user?.id} typingUsers={typingUsers} />
      <div ref={bottomRef} />
      <MessageInput onSend={(content) => sendMessage(chatId, content)} onTyping={() => sendTyping(chatId)} onStopTyping={() => sendStopTyping(chatId)} />
    </div>
  );
};

export default ChatWindow;