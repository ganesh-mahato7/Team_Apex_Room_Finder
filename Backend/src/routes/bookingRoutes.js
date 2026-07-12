import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// User
router.post('/',           authenticate, requireRole('user'), bookingController.createBooking);
router.get('/my',          authenticate, requireRole('user'), bookingController.getMyBookings);
router.patch('/:id/cancel', authenticate, requireRole('user'), bookingController.cancelBooking);

// Landlord
router.get('/landlord',      authenticate, requireRole('landlord'), bookingController.getLandlordBookings);
router.patch('/:id/respond', authenticate, requireRole('landlord'), bookingController.respondBooking);

export default router;