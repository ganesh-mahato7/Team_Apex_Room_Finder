import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

import authRoutes  from './routes/authRoutes.js';
import userRoutes  from './routes/userRoutes.js';
import roomRoutes  from './routes/roomRoutes.js';
import chatRoutes  from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc:     ["'self'", 'data:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'", env.clientUrl],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: env.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

app.use('/api/', apiLimiter);

app.use('/api/auth',  authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', env: env.nodeEnv }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use(errorMiddleware);

export default app;