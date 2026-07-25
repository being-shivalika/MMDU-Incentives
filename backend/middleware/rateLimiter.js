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
