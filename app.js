import express from 'express';
import auth from './routes/auth.js';
import tasks from './routes/tasks.js';

const app = express();

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);

export default app;