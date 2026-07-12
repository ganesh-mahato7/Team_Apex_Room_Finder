import api from './api.js';

export const createBookingRequest      = (roomId, message) => api.post('/bookings', { roomId, message });
export const getMyBookingRequests      = ()                => api.get('/bookings/my');
export const getLandlordBookingRequests = ()               => api.get('/bookings/landlord');
export const respondToBookingRequest   = (id, status)      => api.patch(`/bookings/${id}/respond`, { status });
export const cancelBookingRequest      = (id)               => api.patch(`/bookings/${id}/cancel`);