import { query } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// --- Landlord verification ---
export const getPendingLandlords = async () => {
  const result = await query(
    `SELECT id, name, email, phone, verification_status, verification_docs, created_at
     FROM users WHERE role='landlord' AND verification_status='pending'
     ORDER BY created_at ASC`
  );
  return result.rows;
};

export const getAllLandlords = async () => {
  const result = await query(
    `SELECT id, name, email, phone, is_verified, verification_status, verification_docs, is_banned, created_at
     FROM users WHERE role='landlord' ORDER BY created_at DESC`
  );
  return result.rows;
};

export const verifyLandlord = async (landlordId, status, adminNote) => {
  if (!['approved', 'rejected'].includes(status)) throw new Error('Invalid status');
  const result = await query(
    `UPDATE users SET
       verification_status=$1,
       is_verified=$2,
       admin_note=$3,
       updated_at=NOW()
     WHERE id=$4 AND role='landlord'
     RETURNING id, name, email, verification_status, is_verified`,
    [status, status === 'approved', adminNote || null, landlordId]
  );
  if (result.rows.length === 0) throw new Error('Landlord not found');
  return result.rows[0];
};

// --- User identity verification ---
export const getUserVerifications = async (status) => {
  const params = [];
  let where = `role='user' AND verification_status != 'none'`;
  if (status) { where += ` AND verification_status=$1`; params.push(status); }
  const result = await query(
    `SELECT id, name, email, phone, verification_status, verification_docs, admin_note, created_at
     FROM users WHERE ${where} ORDER BY created_at ASC`,
    params
  );
  return result.rows;
};

export const verifyUserIdentity = async (userId, status, adminNote) => {
  if (!['approved', 'rejected'].includes(status)) throw new Error('Invalid status');
  const result = await query(
    `UPDATE users SET
       verification_status=$1,
       is_verified=$2,
       admin_note=$3,
       updated_at=NOW()
     WHERE id=$4 AND role='user'
     RETURNING id, name, email, verification_status, is_verified`,
    [status, status === 'approved', adminNote || null, userId]
  );
  if (result.rows.length === 0) throw new Error('User not found');
  return result.rows[0];
};

// --- Room moderation ---
export const getPendingRooms = async () => {
  const result = await query(
    `SELECT r.*, u.name AS landlord_name, u.email AS landlord_email
     FROM rooms r JOIN users u ON r.landlord_id = u.id
     WHERE r.status='pending' ORDER BY r.created_at ASC`
  );
  return result.rows;
};

export const getAllRooms = async ({ page = 1, limit = 20, status }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let i = 1;
  if (status) { conditions.push(`r.status=$${i++}`); params.push(status); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  params.push(limit, offset);

  const result = await query(
    `SELECT r.*, u.name AS landlord_name
     FROM rooms r JOIN users u ON r.landlord_id = u.id
     ${where} ORDER BY r.created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    params
  );
  const count = await query(`SELECT COUNT(*) FROM rooms r ${where}`, params.slice(0, -2));
  return { rooms: result.rows, total: parseInt(count.rows[0].count) };
};

export const updateRoomStatus = async (roomId, status, adminNote) => {
  const validStatuses = ['active', 'rejected', 'removed'];
  if (!validStatuses.includes(status)) throw new Error('Invalid status');
  const result = await query(
    `UPDATE rooms SET status=$1, admin_note=$2, updated_at=NOW()
     WHERE id=$3 RETURNING *`,
    [status, adminNote || null, roomId]
  );
  if (result.rows.length === 0) throw new Error('Room not found');
  return result.rows[0];
};

// --- Reports ---
export const getAllReports = async ({ status }) => {
  const conditions = [];
  const params = [];
  if (status) { conditions.push(`rp.status=$1`); params.push(status); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const result = await query(
    `SELECT rp.*,
       reporter.name AS reported_by_name,
       r.title AS room_title,
       u.name AS reported_user_name
     FROM reports rp
     JOIN users reporter ON rp.reported_by = reporter.id
     LEFT JOIN rooms r ON rp.room_id = r.id
     LEFT JOIN users u ON rp.reported_user_id = u.id
     ${where}
     ORDER BY rp.created_at DESC`,
    params
  );
  return result.rows;
};

export const resolveReport = async (reportId, action, adminNote) => {
  const report = await query('SELECT * FROM reports WHERE id=$1', [reportId]);
  if (report.rows.length === 0) throw new Error('Report not found');

  const r = report.rows[0];

  if (action === 'ban_user' && r.reported_user_id) {
    await query(`UPDATE users SET is_banned=true, updated_at=NOW() WHERE id=$1`, [r.reported_user_id]);
  }
  if (action === 'delete_room' && r.room_id) {
    await query(`UPDATE rooms SET status='removed', updated_at=NOW() WHERE id=$1`, [r.room_id]);
  }
  if (action === 'ban_and_delete') {
    if (r.reported_user_id) await query(`UPDATE users SET is_banned=true WHERE id=$1`, [r.reported_user_id]);
    if (r.room_id) await query(`UPDATE rooms SET status='removed' WHERE id=$1`, [r.room_id]);
  }

  const result = await query(
    `UPDATE reports SET status='resolved', action_taken=$1, admin_note=$2, updated_at=NOW()
     WHERE id=$3 RETURNING *`,
    [action, adminNote || null, reportId]
  );
  return result.rows[0];
};

// --- Users ---
export const getAllUsers = async () => {
  const result = await query(
    `SELECT id, name, email, role, is_banned, verification_status, verification_docs, created_at FROM users
     WHERE role != 'admin' ORDER BY created_at DESC`
  );
  return result.rows;
};

export const toggleUserBan = async (userId) => {
  const result = await query(
    `UPDATE users SET is_banned = NOT is_banned, updated_at=NOW()
     WHERE id=$1 AND role != 'admin'
     RETURNING id, name, email, is_banned`,
    [userId]
  );
  if (result.rows.length === 0) throw new Error('User not found');
  return result.rows[0];
};

// --- Stats ---
export const getDashboardStats = async () => {
  const [users, rooms, reports, pendingLandlords] = await Promise.all([
    query(`SELECT COUNT(*) FROM users WHERE role='user'`),
    query(`SELECT COUNT(*) FROM rooms WHERE status='active'`),
    query(`SELECT COUNT(*) FROM reports WHERE status='open'`),
    query(`SELECT COUNT(*) FROM users WHERE role='landlord' AND verification_status='pending'`),
  ]);
  return {
    totalUsers: parseInt(users.rows[0].count),
    activeRooms: parseInt(rooms.rows[0].count),
    openReports: parseInt(reports.rows[0].count),
    pendingLandlords: parseInt(pendingLandlords.rows[0].count),
  };
};