import { query } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const getOrCreateChat = async (userId, landlordId, roomId) => {
  const existing = await query(
    `SELECT * FROM chats WHERE user_id=$1 AND landlord_id=$2 AND room_id=$3`,
    [userId, landlordId, roomId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const id = uuidv4();
  const result = await query(
    `INSERT INTO chats (id, user_id, landlord_id, room_id)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [id, userId, landlordId, roomId]
  );
  return result.rows[0];
};

export const getUserChats = async (userId, role) => {
  const field = role === 'landlord' ? 'c.landlord_id' : 'c.user_id';
  const result = await query(
    `SELECT c.*,
       r.title AS room_title,
       r.images AS room_images,
       u.name AS user_name,
       l.name AS landlord_name,
       (SELECT content FROM messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
       (SELECT created_at FROM messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1) AS last_message_at
     FROM chats c
     JOIN rooms r ON c.room_id = r.id
     JOIN users u ON c.user_id = u.id
     JOIN users l ON c.landlord_id = l.id
     WHERE ${field} = $1
     ORDER BY last_message_at DESC NULLS LAST`,
    [userId]
  );
  return result.rows;
};

export const getChatMessages = async (chatId, userId) => {
  // Verify user belongs to this chat
  const chat = await query(
    `SELECT * FROM chats WHERE id=$1 AND (user_id=$2 OR landlord_id=$2)`,
    [chatId, userId]
  );
  if (chat.rows.length === 0) throw new Error('Chat not found or unauthorized');

  const messages = await query(
    `SELECT m.*, u.name AS sender_name
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.chat_id = $1
     ORDER BY m.created_at ASC`,
    [chatId]
  );
  return { chat: chat.rows[0], messages: messages.rows };
};

export const saveMessage = async (chatId, senderId, content) => {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO messages (id, chat_id, sender_id, content)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [id, chatId, senderId, content]
  );
  return result.rows[0];
};