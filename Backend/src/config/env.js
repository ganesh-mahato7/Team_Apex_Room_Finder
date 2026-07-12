import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port:    process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  db: {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    name:     process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    secret:         process.env.JWT_SECRET,
    refreshSecret:  process.env.JWT_REFRESH_SECRET,
    expiresIn:      process.env.JWT_EXPIRES_IN      || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey:    process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  admin: {
    email:    process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },

  mail: {
    host:            process.env.SMTP_HOST,
    port:            process.env.SMTP_PORT,
    user:            process.env.SMTP_USER,
    pass:            process.env.SMTP_PASS,
    fromName:        process.env.SMTP_FROM_NAME     || 'RoomFinder',
    resetPasswordUrl: process.env.RESET_PASSWORD_URL || 'http://localhost:5173/reset-password',
  },
};