import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';

export default class Task extends
Model {
    static initModel(sequelize) {
 Task.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Task',
  tableName: 'Tasks',
  timestamps: true,
  paranoid: true //To enable soft delete
});

return Task;
    }}