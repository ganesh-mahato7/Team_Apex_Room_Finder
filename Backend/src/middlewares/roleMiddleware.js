import { errorResponse } from '../utils/response.js';

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return errorResponse(res, 'Unauthorized', 401);
  if (!roles.includes(req.user.role)) return errorResponse(res, 'Access denied', 403);
  next();
};

export const requireVerifiedLandlord = (req, res, next) => {
  if (req.user.role !== 'landlord') return errorResponse(res, 'Access denied', 403);
  if (req.user.verification_status !== 'approved') {
    return errorResponse(res, 'Your landlord account is not verified yet. Please wait for admin approval.', 403);
  }
  next();
};