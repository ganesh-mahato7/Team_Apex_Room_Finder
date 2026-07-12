import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../middlewares/validate.js';
import { authLimiter, forgotLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/register',          authLimiter,   validate(registerSchema),       authController.register);
router.get('/verify-email',                                                       authController.verifyEmail);
router.post('/resend-verification', authLimiter,                                  authController.resendVerification);
router.post('/login',             authLimiter,   validate(loginSchema),          authController.login);
router.post('/refresh',                                                           authController.refresh);
router.post('/logout',                                                            authController.logout);
router.post('/forgot-password',   forgotLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password',    authLimiter,   validate(resetPasswordSchema),  authController.resetPassword);
router.get('/me',                 authenticate,                                   authController.getMe);

export default router;