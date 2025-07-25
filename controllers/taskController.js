import db from '../models/index.js';
import sendEmail from '../utils/sendEmail.js'; // Assuming you have this
const { Task, User } = db;

// Create a new task
export const createTask = async (req, res) => {
  try {
    console.log('Creating task for user ID:', req.user.id);

    const task = await Task.create({
      ...req.body,
      userId: req.user.id, // Make sure this is lowercase!
    });

    const user = await User.findByPk(req.user.id);

    // Send an email (optional)
    if (user?.email) {
      await sendEmail(user.email, 'New Task Created', `Your task "${task.title}" was created.`);
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks for logged-in user
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
    });

    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ task });
  } catch (err) {
    console.error('Error getting task:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.update(req.body);

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Move a task (move to trash)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.destroy(); // This will soft-delete due to paranoid: true

    res.status(200).json({ message: 'Task moved to trash' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tasks in trash bin
export const getTrashedTasks = async (req, res) => {
  try {
    const trashedTasks = await Task.findAll({
      where: { userId: req.user.id },
      paranoid: false,
    });

    const onlyDeleted = trashedTasks.filter(t => t.deletedAt !== null);

    res.status(200).json({ trashed: onlyDeleted });
  } catch (err) {
    console.error('Error fetching trashed tasks:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Permanently delete a task
export const hardDeleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      paranoid: false,
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.destroy({ force: true }); // 👈 PERMANENT delete

    res.status(200).json({ message: 'Task permanently deleted' });
  } catch (err) {
    console.error('Error hard-deleting task:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
