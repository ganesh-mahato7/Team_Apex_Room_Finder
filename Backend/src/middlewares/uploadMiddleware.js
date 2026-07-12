import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key:    env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only JPG, PNG, WEBP, PDF allowed.'), false);
};

export const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// ── Wrap multer to catch errors properly ─────────────────────
const wrapMulter = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large. Max 10MB per file.' });
    if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ success: false, message: 'Too many files uploaded.' });
    if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ success: false, message: `Unexpected field: ${err.field}` });
    return res.status(400).json({ success: false, message: err.message || 'File upload error' });
  });
};

// Room images — max 6, 5MB each
export const uploadRoomImages = wrapMulter(multer({
  storage, fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
}).array('images', 6));

// Landlord verification — 4 fields, 10MB each
export const uploadVerificationDocs = wrapMulter(multer({
  storage, fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'idImage',       maxCount: 1 },
  { name: 'selfie',        maxCount: 1 },
  { name: 'landDocument',  maxCount: 1 },
  { name: 'buildingImage', maxCount: 1 },
]));

// User ID verification — idImage only
export const uploadUserIdDoc = wrapMulter(multer({
  storage, fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([{ name: 'idImage', maxCount: 1 }]));