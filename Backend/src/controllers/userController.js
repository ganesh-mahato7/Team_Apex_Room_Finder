import { query } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { uploadToCloudinary } from '../middlewares/uploadMiddleware.js';
import { v4 as uuidv4 } from 'uuid';

export const getProfile = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, role, is_verified, is_email_verified,
              verification_status, verification_docs, admin_note, is_banned, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    return successResponse(res, 'Profile fetched', { user: result.rows[0] });
  } catch (err) { return errorResponse(res, err.message); }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const result = await query(
      `UPDATE users SET name=$1, phone=$2, updated_at=NOW()
       WHERE id=$3 RETURNING id, name, email, phone, role`,
      [name, phone || null, req.user.id]
    );
    return successResponse(res, 'Profile updated', { user: result.rows[0] });
  } catch (err) { return errorResponse(res, err.message); }
};

// ── LANDLORD: submit all 4 docs ───────────────────────────────
export const submitVerification = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return errorResponse(res, 'Only landlords can submit verification', 403);
    }
    if (req.user.verification_status === 'approved') {
      return errorResponse(res, 'Your account is already verified');
    }

    // Log what arrived for debugging
    console.log('📁 Files received:', Object.keys(req.files || {}));
    console.log('📋 Body received:', req.body);

    const idImageFile     = req.files?.idImage?.[0];
    const selfieFile      = req.files?.selfie?.[0];
    const landDocFile     = req.files?.landDocument?.[0];
    const buildingImgFile = req.files?.buildingImage?.[0];
    const idType          = req.body?.idType;

    const missing = [];
    if (!idImageFile)     missing.push('idImage');
    if (!selfieFile)      missing.push('selfie');
    if (!landDocFile)     missing.push('landDocument');
    if (!buildingImgFile) missing.push('buildingImage');
    if (!idType)          missing.push('idType');

    if (missing.length > 0) {
      return errorResponse(res, `Missing required fields: ${missing.join(', ')}`);
    }

    console.log('☁️  Uploading to Cloudinary...');

    const [idImageUrl, selfieUrl, landDocUrl, buildingImgUrl] = await Promise.all([
      uploadToCloudinary(idImageFile.buffer,     'room-finder/verifications', { resource_type: 'auto' }),
      uploadToCloudinary(selfieFile.buffer,      'room-finder/verifications', { resource_type: 'auto' }),
      uploadToCloudinary(landDocFile.buffer,     'room-finder/verifications', { resource_type: 'auto' }),
      uploadToCloudinary(buildingImgFile.buffer, 'room-finder/verifications', { resource_type: 'auto' }),
    ]);

    console.log('✅ Cloudinary upload complete');

    const docs = JSON.stringify({
      idImage:       idImageUrl,
      selfie:        selfieUrl,
      landDocument:  landDocUrl,
      buildingImage: buildingImgUrl,
      idType,
    });

    await query(
      `UPDATE users SET verification_docs=$1, verification_status='pending', updated_at=NOW()
       WHERE id=$2`,
      [docs, req.user.id]
    );

    return successResponse(res, 'Documents submitted successfully. Admin will review within 24-48 hours.');
  } catch (err) {
    console.error('❌ Verification submission error:', err.message);
    return errorResponse(res, err.message || 'Failed to submit verification documents');
  }
};

// ── USER: submit ID only ──────────────────────────────────────
export const submitUserVerification = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return errorResponse(res, 'This endpoint is for users only', 403);
    }

    const idImageFile = req.files?.idImage?.[0];
    const idType      = req.body?.idType;

    if (!idImageFile) return errorResponse(res, 'idImage is required');
    if (!idType)      return errorResponse(res, 'idType is required');

    const idImageUrl = await uploadToCloudinary(
      idImageFile.buffer,
      'room-finder/user-verifications',
      { resource_type: 'auto' }
    );

    const docs = JSON.stringify({ idImage: idImageUrl, idType });

    await query(
      `UPDATE users SET verification_docs=$1, verification_status='pending', updated_at=NOW()
       WHERE id=$2`,
      [docs, req.user.id]
    );

    return successResponse(res, 'Identity submitted successfully.');
  } catch (err) {
    console.error('❌ User verification error:', err.message);
    return errorResponse(res, err.message || 'Failed to submit identity');
  }
};

export const submitReport = async (req, res) => {
  try {
    const { roomId, reportedUserId, reason } = req.body;
    if (!reason) return errorResponse(res, 'Reason is required');
    if (!roomId && !reportedUserId) return errorResponse(res, 'Provide roomId or reportedUserId');

    await query(
      `INSERT INTO reports (id, reported_by, room_id, reported_user_id, reason)
       VALUES ($1,$2,$3,$4,$5)`,
      [uuidv4(), req.user.id, roomId || null, reportedUserId || null, reason]
    );
    return successResponse(res, 'Report submitted', null, 201);
  } catch (err) { return errorResponse(res, err.message); }
};