import { query } from '../config/db.js';
import { hashPassword, comparePassword, generateResetToken, hashToken } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
} from './emailService.js';

const sanitizeUser = (user) => {
  const { password, email_verify_token, email_verify_expires, ...safe } = user;
  return safe;
};

// ── REGISTER ──────────────────────────────────────────────────
export const registerUser = async ({ name, email, password, role, phone }) => {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) throw new Error('Email already registered');

  const hashed     = await hashPassword(password);
  const id         = uuidv4();
  const emailToken = crypto.randomBytes(32).toString('hex');
  const expires    = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await query(
    `INSERT INTO users (id, name, email, password, role, phone, email_verify_token, email_verify_expires)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [id, name, email, hashed, role, phone || null, emailToken, expires]
  );

  // Send verification email (non-blocking — don't fail registration if email fails)
  try {
    await sendVerificationEmail(email, name, emailToken, role);
  } catch (err) {
    console.error('⚠️  Verification email failed:', err.message);
  }

  return { message: `Registration successful. Please check ${email} to verify your account.` };
};

// ── VERIFY EMAIL ──────────────────────────────────────────────
export const verifyEmail = async (token) => {
  if (!token) throw new Error('Verification token is required');

  const result = await query(
    `SELECT * FROM users WHERE email_verify_token = $1 AND email_verify_expires > NOW()`,
    [token]
  );
  if (result.rows.length === 0) throw new Error('Invalid or expired verification link');

  const user = result.rows[0];
  if (user.is_email_verified) throw new Error('Email already verified');

  await query(
    `UPDATE users SET
       is_email_verified   = TRUE,
       email_verify_token  = NULL,
       email_verify_expires = NULL,
       updated_at          = NOW()
     WHERE id = $1`,
    [user.id]
  );

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name, user.role);
  } catch {}

  return { message: 'Email verified successfully! You can now log in.', role: user.role };
};

// ── RESEND VERIFICATION ───────────────────────────────────────
export const resendVerification = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return; // Silent

  const user = result.rows[0];
  if (user.is_email_verified) throw new Error('Email is already verified');

  const emailToken = crypto.randomBytes(32).toString('hex');
  const expires    = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await query(
    `UPDATE users SET email_verify_token = $1, email_verify_expires = $2 WHERE id = $3`,
    [emailToken, expires, user.id]
  );

  await sendVerificationEmail(user.email, user.name, emailToken, user.role);
};

// ── LOGIN ─────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) throw new Error('Invalid email or password');

  const user = result.rows[0];
  if (user.is_banned) throw new Error('Your account has been banned');

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('Invalid email or password');

  // Require email verification
  if (!user.is_email_verified) {
    throw new Error('Please verify your email before logging in. Check your inbox.');
  }

  const payload      = { id: user.id, role: user.role };
  const accessToken  = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await query(
    `INSERT INTO refresh_tokens (id, user_id, token, expires_at)
     VALUES ($1,$2,$3, NOW() + INTERVAL '7 days')`,
    [uuidv4(), user.id, refreshToken]
  );

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

// ── REFRESH TOKEN ─────────────────────────────────────────────
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token');

  const decoded = verifyRefreshToken(refreshToken);

  const stored = await query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [refreshToken]
  );
  if (stored.rows.length === 0) throw new Error('Invalid or expired refresh token');

  await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);

  const userResult = await query('SELECT id, role, is_banned FROM users WHERE id = $1', [decoded.id]);
  if (userResult.rows.length === 0) throw new Error('User not found');
  const user = userResult.rows[0];
  if (user.is_banned) throw new Error('Your account has been banned');

  const newAccessToken  = generateAccessToken({ id: user.id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user.id, role: user.role });

  await query(
    `INSERT INTO refresh_tokens (id, user_id, token, expires_at)
     VALUES ($1,$2,$3, NOW() + INTERVAL '7 days')`,
    [uuidv4(), user.id, newRefreshToken]
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ── LOGOUT ────────────────────────────────────────────────────
export const logoutUser = async (refreshToken) => {
  if (refreshToken) await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
};

// ── FORGOT / RESET PASSWORD ───────────────────────────────────
export const requestPasswordReset = async (email) => {
  const result = await query('SELECT id, name, email FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return;

  const user = result.rows[0];
  const { rawToken, hashedToken } = generateResetToken();

  await query('UPDATE password_resets SET used = TRUE WHERE user_id = $1 AND used = FALSE', [user.id]);
  await query(
    `INSERT INTO password_resets (id, user_id, token, expires_at)
     VALUES ($1,$2,$3, NOW() + INTERVAL '30 minutes')`,
    [uuidv4(), user.id, hashedToken]
  );

  await sendResetPasswordEmail(user.email, user.name, rawToken);
};

export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = hashToken(rawToken);

  const result = await query(
    `SELECT pr.*, u.name, u.email FROM password_resets pr
     JOIN users u ON pr.user_id = u.id
     WHERE pr.token = $1 AND pr.used = FALSE AND pr.expires_at > NOW()`,
    [hashedToken]
  );
  if (result.rows.length === 0) throw new Error('Invalid or expired reset link');

  const rec            = result.rows[0];
  const hashedPassword = await hashPassword(newPassword);

  await query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashedPassword, rec.user_id]);
  await query('UPDATE password_resets SET used=TRUE WHERE id=$1', [rec.id]);
  await query('DELETE FROM refresh_tokens WHERE user_id=$1', [rec.user_id]);

  await sendPasswordChangedEmail(rec.email, rec.name);
};