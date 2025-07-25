import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTrashedTasks,
  restoreTask
} from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all routes below
router.use(auth);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask); // No need to reapply auth — already covered by router.use
router.get('/trash', getTrashedTasks);
router.post('/restore/:id', restoreTask);

export default router;