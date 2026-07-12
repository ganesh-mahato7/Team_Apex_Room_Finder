import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSocket } from '../socket/socket.js';
import { SOCKET_EVENTS } from '../socket/socketEvents.js';
import { useAuth } from './AuthContext.jsx';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) {
      // If you ever see this warning, connectSocket() hasn't been called
      // yet at this point — check AuthContext's login/init flow.
      console.warn('ChatContext: socket not available yet');
      return;
    }
    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (msg) => setMessages((prev) => [...prev, msg]));
    socket.on(SOCKET_EVENTS.USER_TYPING, ({ userId }) =>
      setTypingUsers((prev) => [...new Set([...prev, userId])])
    );
    socket.on(SOCKET_EVENTS.USER_STOP_TYPING, ({ userId }) =>
      setTypingUsers((prev) => prev.filter((id) => id !== userId))
    );

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
      socket.off(SOCKET_EVENTS.USER_TYPING);
      socket.off(SOCKET_EVENTS.USER_STOP_TYPING);
    };
  }, [user]);

  const joinChat = (chatId) => {
    setActiveChat(chatId);
    socketRef.current?.emit(SOCKET_EVENTS.JOIN_CHAT, chatId);
  };

  const sendMessage = (chatId, content) =>
    socketRef.current?.emit(SOCKET_EVENTS.SEND_MESSAGE, { chatId, content });

  const sendTyping = (chatId) => socketRef.current?.emit(SOCKET_EVENTS.TYPING, { chatId });
  const sendStopTyping = (chatId) => socketRef.current?.emit(SOCKET_EVENTS.STOP_TYPING, { chatId });

  return (
    <ChatContext.Provider
      value={{ activeChat, messages, setMessages, typingUsers, joinChat, sendMessage, sendTyping, sendStopTyping }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);