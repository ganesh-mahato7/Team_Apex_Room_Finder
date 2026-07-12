import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { env } from './src/config/env.js';
import { initChatSocket } from './src/sockets/chatSocket.js';

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
});

initChatSocket(io);

httpServer.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
  console.log(`🌍 Environment: ${env.nodeEnv}`);
});