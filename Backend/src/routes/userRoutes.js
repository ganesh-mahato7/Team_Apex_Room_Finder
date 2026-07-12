import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { uploadVerificationDocs, uploadUserIdDoc } from '../middlewares/uploadMiddleware.js';
import { validate, reportSchema, profileSchema } from '../middlewares/validate.js';
import { uploadLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.get('/profile',               authenticate, userController.getProfile);
router.put('/profile',               authenticate, validate(profileSchema), userController.updateProfile);

// Landlord full verification (idImage + selfie + landDocument + buildingImage)
router.post('/verify',               authenticate, uploadLimiter, uploadVerificationDocs, userController.submitVerification);

// User identity verification (idImage only)
router.post('/verify-identity',      authenticate, uploadLimiter, uploadUserIdDoc, userController.submitUserVerification);

router.post('/report',               authenticate, validate(reportSchema), userController.submitReport);

export default router;