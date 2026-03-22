import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getFavoriteDishes,
  addFavoriteDish,
  removeFavoriteDish
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Favorite dishes routes
router.get('/favorite-dishes', protect, getFavoriteDishes);
router.post('/favorite-dishes', protect, addFavoriteDish);
router.delete('/favorite-dishes/:dishId', protect, removeFavoriteDish);

export default router;
