import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';

const Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    priority: DataTypes.STRING,
    deadline: DataTypes.DATE,
});

User.hasMany(Task);
Task.belongsTo(User);

export default Task;