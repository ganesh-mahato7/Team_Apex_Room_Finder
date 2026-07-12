import { query } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createBookingRequest = async (userId, roomId, message) => {
  const roomRes = await query('SELECT id, landlord_id, status FROM rooms WHERE id=$1', [roomId]);
  if (roomRes.rows.length === 0) throw new Error('Room not found');
  const room = roomRes.rows[0];

  if (room.status !== 'active') throw new Error('This room is not available for booking');
  if (room.landlord_id === userId) throw new Error('You cannot request your own room');

  const existing = await query(
    `SELECT id FROM booking_requests WHERE room_id=$1 AND user_id=$2 AND status='pending'`,
    [roomId, userId]
  );
  if (existing.rows.length > 0) throw new Error('You already have a pending request for this room');

  const id = uuidv4();
  const result = await query(
    `INSERT INTO booking_requests (id, room_id, user_id, landlord_id, message, status)
     VALUES ($1,$2,$3,$4,$5,'pending') RETURNING *`,
    [id, roomId, userId, room.landlord_id, message || null]
  );
  return result.rows[0];
};

export const getMyBookingRequests = async (userId) => {
  const result = await query(
    `SELECT br.*, r.title AS room_title, r.location AS room_location, r.price AS room_price,
            l.name AS landlord_name, l.phone AS landlord_phone
     FROM booking_requests br
     JOIN rooms r ON br.room_id = r.id
     JOIN users l ON br.landlord_id = l.id
     WHERE br.user_id=$1 ORDER BY br.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getLandlordBookingRequests = async (landlordId) => {
  const result = await query(
    `SELECT br.*, r.title AS room_title, r.location AS room_location, r.price AS room_price,
            u.name AS user_name, u.email AS user_email, u.phone AS user_phone
     FROM booking_requests br
     JOIN rooms r ON br.room_id = r.id
     JOIN users u ON br.user_id = u.id
     WHERE br.landlord_id=$1 ORDER BY br.created_at DESC`,
    [landlordId]
  );
  return result.rows;
};

export const respondToBookingRequest = async (requestId, landlordId, status) => {
  if (!['accepted', 'rejected'].includes(status)) throw new Error('Invalid status');
  const result = await query(
    `UPDATE booking_requests SET status=$1, updated_at=NOW()
     WHERE id=$2 AND landlord_id=$3 AND status='pending'
     RETURNING *`,
    [status, requestId, landlordId]
  );
  if (result.rows.length === 0) throw new Error('Request not found or already responded to');
  return result.rows[0];
};

export const cancelBookingRequest = async (requestId, userId) => {
  const result = await query(
    `UPDATE booking_requests SET status='cancelled', updated_at=NOW()
     WHERE id=$1 AND user_id=$2 AND status='pending'
     RETURNING *`,
    [requestId, userId]
  );
  if (result.rows.length === 0) throw new Error('Request not found or cannot be cancelled');
  return result.rows[0];
};