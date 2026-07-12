import api from './api.js';

export const getRooms         = (params) => api.get('/rooms', { params });
export const getRoomById      = (id)     => api.get(`/rooms/${id}`);

// ⚠️ No Content-Type header — let axios set it with FormData boundary
export const createRoom       = (data)   => api.post('/rooms', data);
export const updateRoom       = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom       = (id)     => api.delete(`/rooms/${id}`);
export const getLandlordRooms = ()       => api.get('/rooms/landlord/my-rooms');
export const toggleFavorite   = (id)     => api.post(`/rooms/${id}/favorite`);
export const getFavorites     = ()       => api.get('/rooms/user/favorites');

// ⚠️ No Content-Type header — let axios set it with FormData boundary
export const submitVerification     = (data) => api.post('/users/verify', data);
export const submitUserVerification = (data) => api.post('/users/verify-identity', data);
export const submitReport           = (data) => api.post('/users/report', data);