import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register',              authController.register);
router.get('/verify-email',           authController.verifyEmail);
router.post('/resend-verification',   authController.resendVerification);
router.post('/login',                 authController.login);
router.post('/refresh',               authController.refresh);
router.post('/logout',                authController.logout);
router.get('/me',                     authenticate, authController.getMe);
router.post('/forgot-password',       authController.forgotPassword);
router.post('/reset-password',        authController.resetPassword);
router.post('/change-password',       authenticate, authController.changePassword);

export default router;