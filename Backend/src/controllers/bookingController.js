import * as bookingService from '../services/bookingService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createBooking = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    if (!roomId) return errorResponse(res, 'roomId is required');
    const booking = await bookingService.createBookingRequest(req.user.id, roomId, message);
    return successResponse(res, 'Booking request sent', { booking }, 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getMyBookingRequests(req.user.id);
    return successResponse(res, 'Your booking requests', { bookings });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getLandlordBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getLandlordBookingRequests(req.user.id);
    return successResponse(res, 'Booking requests', { bookings });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const respondBooking = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.respondToBookingRequest(req.params.id, req.user.id, status);
    return successResponse(res, `Request ${status}`, { booking });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBookingRequest(req.params.id, req.user.id);
    return successResponse(res, 'Request cancelled', { booking });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};