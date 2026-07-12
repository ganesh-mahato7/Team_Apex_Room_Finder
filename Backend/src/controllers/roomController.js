import * as roomService from '../services/roomService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { query } from '../config/db.js';
import { uploadToCloudinary } from '../middlewares/uploadMiddleware.js';

export const createRoom = async (req, res) => {
  try {
    // Upload each file buffer to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'room-finder/rooms', {
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
        });
        imageUrls.push(url);
      }
    }
    const room = await roomService.createRoom(req.user.id, req.body, imageUrls);
    return successResponse(res, 'Room submitted for review', { room }, 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getRooms = async (req, res) => {
  try {
    const data = await roomService.getRooms(req.query);
    return successResponse(res, 'Rooms fetched', data);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    return successResponse(res, 'Room fetched', { room });
  } catch (err) {
    return errorResponse(res, err.message, 404);
  }
};

export const getLandlordRooms = async (req, res) => {
  try {
    const rooms = await roomService.getLandlordRooms(req.user.id);
    return successResponse(res, 'Your rooms fetched', { rooms });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const updateRoom = async (req, res) => {
  try {
    const existing = await query('SELECT landlord_id FROM rooms WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) return errorResponse(res, 'Room not found', 404);
    if (existing.rows[0].landlord_id !== req.user.id) return errorResponse(res, 'Not authorized', 403);

    // ⚠️ FIX: this previously never looked at req.files at all, so newly
    // uploaded images had nowhere to go even once they reached the server.
    // Same upload pattern as createRoom above.
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'room-finder/rooms', {
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
        });
        imageUrls.push(url);
      }
    }

    const room = await roomService.updateRoom(req.params.id, req.user.id, req.body, imageUrls);
    return successResponse(res, 'Room updated', { room });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const deleteRoom = async (req, res) => {
  try {
    if (req.user.role === 'landlord') {
      const existing = await query('SELECT landlord_id FROM rooms WHERE id = $1', [req.params.id]);
      if (existing.rows.length === 0) return errorResponse(res, 'Room not found', 404);
      if (existing.rows[0].landlord_id !== req.user.id) return errorResponse(res, 'Not authorized', 403);
    }
    await roomService.deleteRoom(req.params.id, req.user.role === 'admin' ? null : req.user.id);
    return successResponse(res, 'Room deleted');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const result = await roomService.toggleFavorite(req.user.id, req.params.id);
    return successResponse(res, result.favorited ? 'Added to favorites' : 'Removed from favorites', result);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const rooms = await roomService.getUserFavorites(req.user.id);
    return successResponse(res, 'Favorites fetched', { rooms });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};