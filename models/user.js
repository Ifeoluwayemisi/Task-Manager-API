import {Model,  DataTypes } from "sequelize";
import sequelize from "../config/database.js";


export default class User extends
Model {
  static initModel(sequelize){
     User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'Users',
  timestamps: true
});
return User
  }
}