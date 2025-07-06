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

router.use(auth);
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', auth, deleteTask);
router.get('/trash', auth, getTrashedTasks);
router.post('/restore/:id', auth, restoreTask)

export default router;