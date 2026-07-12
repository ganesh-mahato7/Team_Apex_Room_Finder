import { z } from 'zod';
import { errorResponse } from '../utils/response.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    console.error('❌ Validation failed:', errors);       // ← add this line
    console.error('   Request body was:', req.body);      // ← and this
    return errorResponse(res, errors[0], 400, errors);
  }
  req.body = result.data;
  next();
};

export const registerSchema = z.object({
  name:     z.string().min(2).max(100).trim(),
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(6).max(128),
  role:     z.enum(['user', 'landlord']),
  phone:    z.string().max(20).optional().or(z.literal('')),  // ← allow empty string
});

export const loginSchema = z.object({
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token:    z.string().min(1),
  password: z.string().min(6).max(128),
});

export const roomSchema = z.object({
  title:       z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(5000).trim(),
  price:       z.coerce.number().positive().max(1000000),
  location:    z.string().min(2).max(200).trim(),
  address:     z.string().min(5).max(500).trim(),
  room_type:   z.enum(['single', 'shared', 'apartment', 'studio', 'house']),
  amenities:   z.string().optional(),
  rules:       z.string().optional(),
});

export const reportSchema = z.object({
  roomId:         z.string().uuid().optional(),
  reportedUserId: z.string().uuid().optional(),
  reason:         z.string().min(10).max(1000).trim(),
});

export const profileSchema = z.object({
  name:  z.string().min(2).max(100).trim(),
  phone: z.string().max(20).optional().or(z.literal('')),  // ← allow empty string
});

export const verifyLandlordSchema = z.object({
  status:    z.enum(['approved', 'rejected']),
  adminNote: z.string().max(500).optional().or(z.literal('')),
});

export const roomStatusSchema = z.object({
  status:    z.enum(['active', 'rejected', 'removed']),
  adminNote: z.string().max(500).optional().or(z.literal('')),
});

export const reportResolveSchema = z.object({
  action:    z.enum(['warn', 'delete_room', 'ban_user', 'ban_and_delete']),
  adminNote: z.string().max(500).optional().or(z.literal('')),
});