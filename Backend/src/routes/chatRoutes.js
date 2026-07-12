import { Router } from 'express';
import * as chatController from '../controllers/chatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/start', authenticate, chatController.startChat);
router.get('/', authenticate, chatController.getMyChats);
router.get('/:chatId/messages', authenticate, chatController.getChatMessages);

export default router;