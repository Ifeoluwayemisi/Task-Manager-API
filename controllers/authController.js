import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import models from '../models/index.js';

dotenv.config();
const { User } = models;

// Generate JWTtoken
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '1d') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

//  REGISTER 
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 8);
    const newUser = await User.create({ email, password: hashed });

    const token = generateToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = generateToken({ id: user.id, email: user.email });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message || 'Login failed' });
  }
};

//  FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  if (!req.body || !req.body.email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = generateToken({ id: user.id }, '30m');
    const resetLink = `http://localhost:5000/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset Your Password',
      html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (emailErr) {
      console.warn('Email failed:', emailErr.message);
      res.status(200).json({
        message: 'Reset link email failed. Showing link in dev mode.',
        link: resetLink,
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.query;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user || user.resetToken !==token) return res.status(401).json({ message: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(newPassword, 8);
    user.password = hashed;
    user.resetToken = null; // Clear reset token after use
    await user.save();

    //auto-login
    const newAuthToken = generateToken({ id: user.id, email: user.email }, '1h');
    return res.status(200).json({
      message: 'Password reset successfully',
      token: newAuthToken,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
      },
    });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

//  GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'avatar', 'createdAt', 'updatedAt'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

//  UPDATE PROFILE 
export const updateProfile = async (req, res) => {
  const { email, password } = req.body;
  const avatar = req.file?.filename;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 8);
      user.password = hashed;
    }

    if (avatar) {
      user.avatar = `/uploads/profile-pics/${avatar}`;
    }

    await user.save();

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      message: 'Profile updated successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

//  DELETE USER
export const deleteUserWithConfirmation = async (req, res) => {
  const { confirm } = req.body;

  if (confirm !== 'DELETE') {
    return res.status(400).json({
      message: 'Please confirm account deletion by sending { "confirm": "DELETE" }',
    });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();

    res.status(200).json({
      message: 'User and associated tasks deleted successfully',
      token: null,
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};