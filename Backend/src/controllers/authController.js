import * as authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return successResponse(res, result.message, null, 201);
  } catch (err) { return errorResponse(res, err.message); }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await authService.verifyEmail(token);
    return successResponse(res, result.message, { role: result.role });
  } catch (err) { return errorResponse(res, err.message, 400); }
};

export const resendVerification = async (req, res) => {
  try {
    await authService.resendVerification(req.body.email);
    return successResponse(res, 'If that email exists and is unverified, a new link has been sent.');
  } catch (err) { return errorResponse(res, err.message); }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    res.cookie('refreshToken', data.refreshToken, COOKIE_OPTS);
    return successResponse(res, 'Login successful', { user: data.user, accessToken: data.accessToken });
  } catch (err) { return errorResponse(res, err.message, 401); }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const data = await authService.refreshAccessToken(refreshToken);
    if (data.refreshToken) res.cookie('refreshToken', data.refreshToken, COOKIE_OPTS);
    return successResponse(res, 'Token refreshed', { accessToken: data.accessToken });
  } catch (err) { return errorResponse(res, err.message, 401); }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    return successResponse(res, 'Logged out successfully');
  } catch (err) { return errorResponse(res, err.message); }
};

export const getMe = async (req, res) => {
  return successResponse(res, 'User fetched', { user: req.user });
};

export const forgotPassword = async (req, res) => {
  try {
    await authService.requestPasswordReset(req.body.email);
    return successResponse(res, 'If an account with that email exists, a reset link has been sent.');
  } catch (err) { return errorResponse(res, err.message); }
};

export const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    return successResponse(res, 'Password reset successful. Please log in.');
  } catch (err) { return errorResponse(res, err.message); }
};