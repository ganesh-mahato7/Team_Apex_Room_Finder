import api from './api.js';

export const startChat = (data) => api.post('/chats/start', data);
export const getMyChats = () => api.get('/chats');
export const getChatMessages = (chatId) => api.get(`/chats/${chatId}/messages`);