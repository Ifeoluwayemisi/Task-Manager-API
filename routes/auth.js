import express from 'express';
import {register, login, forgotPassword, resetPassword, getProfile, updateProfile, deleteUserWithConfirmation} from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import upload from '../config/multer.js';


const router = express.Router();

router.post('/register', auth, register);
router.post('/login', auth, login);
router.post('/forgot-password', auth, forgotPassword);
router.post('/reset-password', auth, resetPassword);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.delete('/profile', auth, deleteUserWithConfirmation);

export default router;