import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteUserWithConfirmation
} from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import upload from '../config/multer.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.delete('/profile', auth, deleteUserWithConfirmation);

export default router;