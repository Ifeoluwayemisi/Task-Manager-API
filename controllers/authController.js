import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import nodemailer from 'nodemailer';


export const register = async (req, res) => {
    const {email, password} = req.body;
    try{
        const hashed = await bcrypt.hash(password, 8);
        const user = await User.create({ email, password:hashed});
    } catch (err) {
         console.error(err);
         res.status(400).json({ error: err.message || "Something went wrong" });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({where: {email}});
        if(!user) return res.status(404).json({message: 'User NOT Found'});
            
            const valid = await bcrypt.compare(password, user.password);
            if(!valid) return res.status(401).json({message:'Invalid Password!'});

            const token = jwt.sign({id: user.id, email:user.email}, process.env.JWT_SECRET);
            res.json({token});
    }  catch (err) {
        res.status(400).json({error: err.message});
    }

    console.log("Incoming password:", password);
    console.log("User hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    const resetLink = `http://localhost:5000/reset-password?token=${token}`;

    // Try to send the email
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
      console.warn('Email failed. Logging reset link instead.');
      console.log('Reset link:', resetLink);
      res.status(200).json({
        message: 'Email failed to send. Reset link has been logged instead (dev mode).',
        link: resetLink,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from token
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash the new password and save
    const hashed = await bcrypt.hash(newPassword, 8);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

export const getProfile = async (req, res) => {
  try{
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'avatar', 'createdAt', 'updatedAt']
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({message: 'Failed to load profile'});
  }
};

export const updateProfile = async (req, res) => {
  const {email, password} = req.body;
  const avatar = req.file?.filename;

  try {
    const user = await User.findByPk(req.user.id);

    if (email && email !== user.email) {
      const exists = await User.findOne({where: {email}});
      if (exists) return res.status(400).json({message: 'Email already in use'});
      user.email = email; 
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 8);
      user.password = hashed;
    }

    if (avatar) {
      user.avatar = '/uploads/profile-pics/${avatar}';
    }

    await user.save();

    // to issue new token if email was updated 
    const token = jwt.sign(
      {
        id: user.id, email:user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 
        process.env.JWT_EXPIRES_IN || 'id'
      }
    );

    res.status(200).json({message: 'Prrofile updated sucessfully', 
      token,
      user: {
        id: user.id,
        email:user.email,
        avatar: user.avatar,
      }
    });
  } catch (err) {
    res.status(500).json({message:'Failed to update profile', error: err.message});
  }
};