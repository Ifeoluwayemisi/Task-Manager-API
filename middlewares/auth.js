import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  // Log the incoming headers
  console.log(' Incoming headers:', req.headers);

  // Grab the token from the Authorization header (with capital A!)
  const authHeader = req.headers['authorization']; // or req.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(' No token provided or wrong format');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log(' Token extracted:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(' Token decoded:', decoded);

    req.user = decoded; // attach decoded user to req
    next();
  } catch (err) {
    console.error(' Token verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default auth;