import dotenv from 'dotenv';
dotenv.config();

const appConfig = {
  port: process.env.PORT || 5000,
  uploadsDir: process.env.UPLOADS_DIR || './uploads',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'application/zip'
  ],
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100,
  currency: 'INR',
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default appConfig;
