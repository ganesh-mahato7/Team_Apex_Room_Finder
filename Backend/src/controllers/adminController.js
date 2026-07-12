import * as adminService from '../services/adminService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDashboard = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, 'Dashboard stats', { stats });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// --- Landlords ---
export const getPendingLandlords = async (req, res) => {
  try {
    const landlords = await adminService.getPendingLandlords();
    return successResponse(res, 'Pending landlords', { landlords });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getAllLandlords = async (req, res) => {
  try {
    const landlords = await adminService.getAllLandlords();
    return successResponse(res, 'All landlords', { landlords });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const verifyLandlord = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const landlord = await adminService.verifyLandlord(req.params.id, status, adminNote);
    return successResponse(res, `Landlord ${status}`, { landlord });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// --- User identity verification ---
export const getUserVerifications = async (req, res) => {
  try {
    const users = await adminService.getUserVerifications(req.query.status);
    return successResponse(res, 'User verifications fetched', { users });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const verifyUserIdentity = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const user = await adminService.verifyUserIdentity(req.params.id, status, adminNote);
    return successResponse(res, `User identity ${status}`, { user });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// --- Rooms ---
export const getPendingRooms = async (req, res) => {
  try {
    const rooms = await adminService.getPendingRooms();
    return successResponse(res, 'Pending rooms', { rooms });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const data = await adminService.getAllRooms(req.query);
    return successResponse(res, 'All rooms', data);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const room = await adminService.updateRoomStatus(req.params.id, status, adminNote);
    return successResponse(res, `Room status updated to ${status}`, { room });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// --- Reports ---
export const getAllReports = async (req, res) => {
  try {
    const reports = await adminService.getAllReports(req.query);
    return successResponse(res, 'Reports fetched', { reports });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { action, adminNote } = req.body;
    const report = await adminService.resolveReport(req.params.id, action, adminNote);
    return successResponse(res, 'Report resolved', { report });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// --- Users ---
export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    return successResponse(res, 'Users fetched', { users });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const toggleBan = async (req, res) => {
  try {
    const user = await adminService.toggleUserBan(req.params.id);
    return successResponse(res, user.is_banned ? 'User banned' : 'User unbanned', { user });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};