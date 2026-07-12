import { verifyAccessToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import { query } from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const result = await query(
      'SELECT id, name, email, role, is_verified, verification_status, is_banned FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) return errorResponse(res, 'User not found', 401);

    const user = result.rows[0];
    if (user.is_banned) return errorResponse(res, 'Your account has been banned', 403);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return errorResponse(res, 'Token expired', 401);
    return errorResponse(res, 'Invalid token', 401);
  }
};