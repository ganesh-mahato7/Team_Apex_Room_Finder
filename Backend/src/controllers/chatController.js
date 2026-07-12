import * as chatService from '../services/chatService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const startChat = async (req, res) => {
  try {
    const { landlordId, roomId } = req.body;
    if (!landlordId || !roomId) return errorResponse(res, 'landlordId and roomId required');
    const chat = await chatService.getOrCreateChat(req.user.id, landlordId, roomId);
    return successResponse(res, 'Chat ready', { chat }, 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getMyChats = async (req, res) => {
  try {
    const chats = await chatService.getUserChats(req.user.id, req.user.role);
    return successResponse(res, 'Chats fetched', { chats });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const data = await chatService.getChatMessages(req.params.chatId, req.user.id);
    return successResponse(res, 'Messages fetched', data);
  } catch (err) {
    return errorResponse(res, err.message, 403);
  }
};