import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validate, verifyLandlordSchema, roomStatusSchema, reportResolveSchema } from '../middlewares/validate.js';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/dashboard', adminController.getDashboard);

router.get('/users',           adminController.getAllUsers);
router.patch('/users/:id/ban', adminController.toggleBan);
router.get('/users/verifications',          adminController.getUserVerifications);
router.patch('/users/:id/verify-identity',  validate(verifyLandlordSchema), adminController.verifyUserIdentity);

router.get('/landlords',              adminController.getAllLandlords);
router.get('/landlords/pending',      adminController.getPendingLandlords);
router.patch('/landlords/:id/verify', validate(verifyLandlordSchema), adminController.verifyLandlord);

// specific before param
router.get('/rooms/pending',       adminController.getPendingRooms);
router.get('/rooms',               adminController.getAllRooms);
router.patch('/rooms/:id/status',  validate(roomStatusSchema), adminController.updateRoomStatus);

router.get('/reports',               adminController.getAllReports);
router.patch('/reports/:id/resolve', validate(reportResolveSchema), adminController.resolveReport);

export default router;