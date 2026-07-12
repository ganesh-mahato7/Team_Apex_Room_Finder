import { verifyAccessToken } from '../utils/jwt.js';
import { saveMessage } from '../services/chatService.js';
import { query } from '../config/db.js';

export const initChatSocket = (io) => {
  // Auth middleware for every socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.id}`);

    // Join a chat room
    socket.on('join_chat', async (chatId) => {
      try {
        const chat = await query(
          `SELECT * FROM chats WHERE id = $1 AND (user_id = $2 OR landlord_id = $2)`,
          [chatId, socket.user.id]
        );
        if (chat.rows.length === 0) {
          socket.emit('error', 'Unauthorized to join this chat');
          return;
        }
        socket.join(`chat_${chatId}`);
        socket.emit('joined_chat', { chatId });
      } catch {
        socket.emit('error', 'Failed to join chat');
      }
    });

    // Send a message
    socket.on('send_message', async ({ chatId, content }) => {
      try {
        if (!chatId || !content?.trim()) return;

        // Enforce payload size
        if (content.length > 2000) {
          socket.emit('error', 'Message too long (max 2000 characters)');
          return;
        }

        // Verify membership
        const chat = await query(
          `SELECT * FROM chats WHERE id = $1 AND (user_id = $2 OR landlord_id = $2)`,
          [chatId, socket.user.id]
        );
        if (chat.rows.length === 0) {
          socket.emit('error', 'Unauthorized');
          return;
        }

        const message = await saveMessage(chatId, socket.user.id, content.trim());

        io.to(`chat_${chatId}`).emit('receive_message', {
          ...message,
          sender_id: socket.user.id,
        });
      } catch {
        socket.emit('error', 'Failed to send message');
      }
    });

    // Typing indicators
    socket.on('typing',      ({ chatId }) => socket.to(`chat_${chatId}`).emit('user_typing',      { userId: socket.user.id }));
    socket.on('stop_typing', ({ chatId }) => socket.to(`chat_${chatId}`).emit('user_stop_typing', { userId: socket.user.id }));

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.user.id}`);
    });
  });
};