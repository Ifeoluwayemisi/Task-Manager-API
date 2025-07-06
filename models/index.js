// models/index.js
import Sequelize from 'sequelize';
import User from './user.js';
import Task from './task.js'; // if you have it

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

User.initModel(sequelize);
Task.initModel(sequelize);

/* const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User(sequelize);
db.Task = Task(sequelize); */

//Relationship
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

export default {sequelize, User, Task};
