import { Router } from 'express';
import * as roomController from '../controllers/roomController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireVerifiedLandlord, requireRole } from '../middlewares/roleMiddleware.js';
import { uploadRoomImages } from '../middlewares/uploadMiddleware.js';
import { uploadLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Public
router.get('/', roomController.getRooms);

// Specific named paths BEFORE /:id to prevent route-matching bug
router.get('/user/favorites',    authenticate, requireRole('user'),     roomController.getFavorites);
router.get('/landlord/my-rooms', authenticate, requireRole('landlord'), roomController.getLandlordRooms);

// Generic param route LAST
router.get('/:id', roomController.getRoomById);

// User
router.post('/:id/favorite', authenticate, requireRole('user'), roomController.toggleFavorite);

// Landlord
router.post('/',    authenticate, requireVerifiedLandlord, uploadLimiter, uploadRoomImages, roomController.createRoom);
router.put('/:id',  authenticate, requireVerifiedLandlord, roomController.updateRoom);
router.delete('/:id', authenticate, requireRole('landlord', 'admin'), roomController.deleteRoom);

export default router;