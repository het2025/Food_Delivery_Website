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

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Favorite dishes routes
router.get('/favorite-dishes', protect, getFavoriteDishes);
router.post('/favorite-dishes', protect, addFavoriteDish);
router.delete('/favorite-dishes/:dishId', protect, removeFavoriteDish);

export default router;
