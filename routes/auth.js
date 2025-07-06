import express from 'express';
import {register, login, forgotPassword, resetPassword, getProfile, updateProfile} from '../controllers/authController.js';
import authenticate from '../middlewares/auth.js';
import upload from '../config/multer.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, upload.single('avatar'), updateProfile)

export default router;