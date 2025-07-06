import Task from '../models/index.js';
import User from '../models/index.js';
import sendEmail from '../utils/sendEmail.js';
import op from 'sequelize'

export const createTask = async (req, res) => {
    try {
        const Task = await Task.create ({
            ...req.body,
            UserId: req.user.id,
        });

        const user = await User.findByPk(req.user.id);
        await sendEmail(user.email, 'New Task Created,' `Your task "${Task.title}" was created.`);

        res.json(task);
    } catch (err){
        res.status(400).json({error: err.message});
    }
};

export const getTasks = async (req,res) => {
    const tasks = await Task.findAll({where: {UserId:req.user.id}});
    res.json(tasks);
};

export const updateTask = async (req, res) => {
    const {id} = req.params;
    await Task.update(req.body, {
        where: {id, UserId: req.user.id}
    });
    res.json({message:'Task updated'});
};

export const deleteTask = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    try {
        const task = await Task.findOne({
            where: {id, userId}
        });

        if (!task) return
        res.status(404).json({message: 'Task not found'});

        await task.destroy();

        res.json({message: 'Task moved to trash.'});
    } catch (error) {
        res.status(500).json({message:'Delete failed', error: error.message});
    }
};

export const getTrashedTasks = async (req, res) => {
    try {
        const tasks = await 
        Task.findAll({
            where: {
                userId: req.user.id,
                deletedAt: {[Op.ne]: null}
            },
            paranoid: false
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({message: 'Error fetching trash', error:
            error.message
        });
    }
};

export const restoreTask = async(req,res) => {
    try {
        const task = await Task.findOne ({
            where: {
                id: req.params.id,
                userId: req.user.id
            }, 
            paranoid: false
        });

        if (!task || !task.deletedAt){
            return
            res.status(404).json({message: 'Task not found or not deleted'});
        }
        await task.restore();
        res.json({message: 'Task restored'});
    } catch (error) {
        res.status(500).json({
            message: 'Restore failed', error: error.message
        });
    }
};