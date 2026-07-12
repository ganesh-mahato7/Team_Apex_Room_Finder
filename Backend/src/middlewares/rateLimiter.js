import rateLimit from 'express-rate-limit';

const make = (windowMs, max, message) =>
  rateLimit({ windowMs, max, message: { success: false, message }, standardHeaders: true, legacyHeaders: false });

export const authLimiter   = make(15 * 60 * 1000, 10,  'Too many attempts. Try again in 15 minutes.');
export const forgotLimiter = make(60 * 60 * 1000, 5,   'Too many reset requests. Try again in 1 hour.');
export const apiLimiter    = make(60 * 1000,       120, 'Too many requests. Please slow down.');
export const uploadLimiter = make(60 * 1000,       20,  'Too many uploads. Please slow down.');