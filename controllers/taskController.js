import Task from '../models/task.js';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';

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
    await Task.destroy({ where: {id, UserId: req.user.id}});
    res.json({message: 'Task deleted'});
};