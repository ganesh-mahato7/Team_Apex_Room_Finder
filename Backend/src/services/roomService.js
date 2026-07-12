import { query } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createRoom = async (landlordId, body, imageUrls) => {
  const { title, description, price, location, address, room_type, amenities, rules } = body;
  const id = uuidv4();

  const result = await query(
    `INSERT INTO rooms
      (id, landlord_id, title, description, price, location, address, room_type, amenities, rules, images, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending')
     RETURNING *`,
    [id, landlordId, title, description, price, location, address, room_type,
      JSON.stringify(amenities || []), JSON.stringify(rules || []), JSON.stringify(imageUrls)]
  );
  return result.rows[0];
};

export const getRooms = async ({ page = 1, limit = 12, location, min_price, max_price, room_type }) => {
  const offset = (page - 1) * limit;
  const conditions = ["r.status = 'active'"];
  const params = [];
  let i = 1;

  if (location) { conditions.push(`r.location ILIKE $${i++}`); params.push(`%${location}%`); }
  if (min_price) { conditions.push(`r.price >= $${i++}`); params.push(min_price); }
  if (max_price) { conditions.push(`r.price <= $${i++}`); params.push(max_price); }
  if (room_type) { conditions.push(`r.room_type = $${i++}`); params.push(room_type); }

  const where = conditions.join(' AND ');

  const countResult = await query(`SELECT COUNT(*) FROM rooms r WHERE ${where}`, params);
  const total = parseInt(countResult.rows[0].count);

  params.push(limit, offset);
  const result = await query(
    `SELECT r.*, u.name AS landlord_name
     FROM rooms r
     JOIN users u ON r.landlord_id = u.id
     WHERE ${where}
     ORDER BY r.created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    params
  );

  return { rooms: result.rows, total, page: parseInt(page), pages: Math.ceil(total / limit) };
};

export const getRoomById = async (id) => {
  const result = await query(
    `SELECT r.*, u.name AS landlord_name, u.phone AS landlord_phone
     FROM rooms r JOIN users u ON r.landlord_id = u.id
     WHERE r.id = $1 AND r.status = 'active'`,
    [id]
  );
  if (result.rows.length === 0) throw new Error('Room not found');
  return result.rows[0];
};

export const getLandlordRooms = async (landlordId) => {
  const result = await query(
    `SELECT * FROM rooms WHERE landlord_id = $1 ORDER BY created_at DESC`,
    [landlordId]
  );
  return result.rows;
};

export const updateRoom = async (id, landlordId, body) => {
  const { title, description, price, location, address, room_type, amenities, rules, is_available } = body;

  const result = await query(
    `UPDATE rooms SET
       title=$1, description=$2, price=$3, location=$4, address=$5,
       room_type=$6, amenities=$7, rules=$8, is_available=$9, updated_at=NOW()
     WHERE id=$10 AND landlord_id=$11
     RETURNING *`,
    [title, description, price, location, address, room_type,
      JSON.stringify(amenities || []), JSON.stringify(rules || []),
      is_available ?? true, id, landlordId]
  );
  if (result.rows.length === 0) throw new Error('Room not found or not authorized');
  return result.rows[0];
};

export const deleteRoom = async (id, landlordId) => {
  const result = await query(
    `UPDATE rooms SET status='removed', updated_at=NOW()
     WHERE id=$1 AND landlord_id=$2 RETURNING id`,
    [id, landlordId]
  );
  if (result.rows.length === 0) throw new Error('Room not found or not authorized');
};

export const toggleFavorite = async (userId, roomId) => {
  const exists = await query(
    'SELECT id FROM favorites WHERE user_id=$1 AND room_id=$2',
    [userId, roomId]
  );
  if (exists.rows.length > 0) {
    await query('DELETE FROM favorites WHERE user_id=$1 AND room_id=$2', [userId, roomId]);
    return { favorited: false };
  } else {
    await query(
      'INSERT INTO favorites (id, user_id, room_id) VALUES ($1,$2,$3)',
      [uuidv4(), userId, roomId]
    );
    return { favorited: true };
  }
};

export const getUserFavorites = async (userId) => {
  const result = await query(
    `SELECT r.*, u.name AS landlord_name
     FROM favorites f
     JOIN rooms r ON f.room_id = r.id
     JOIN users u ON r.landlord_id = u.id
     WHERE f.user_id = $1 AND r.status = 'active'
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return result.rows;
};