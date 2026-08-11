import rateLimit from 'express-rate-limit';
import appConfig from '../config/appConfig.js';

export const apiLimiter = rateLimit({
  windowMs: appConfig.rateLimitWindow,
  max: appConfig.rateLimitMax,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 requests per 15 minutes per IP
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

