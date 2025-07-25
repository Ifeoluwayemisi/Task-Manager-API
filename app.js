import express from 'express';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

//health check route
app.get('/', (req, res) => {
  res.send('API is up and running!');
});

export default app;
